"""
model.py

TRL-3 proof of concept for the "ML Prediction Engine": a real model trained
and evaluated on the synthetic dataset, replacing the hardcoded confidence
percentages in server/data/complaints.json.

Task framing: for each case, several candidate ATMs are known (from the
mule chain's last hop). The model scores each candidate; we then rank them
and check whether the model's #1 pick (and top-3) matches the historically
actual cash-out location.

Train/test split is done by CASE, not by row, so no candidate from a test
case ever leaks into training.

Run: python3 model.py
Reads:  dataset.json
Writes: model_results.json
"""

import json
import numpy as np
from sklearn.model_selection import GroupShuffleSplit
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score

with open("dataset.json") as f:
    cases = json.load(f)

FEATURES = [
    "distance_km_from_last_hop",
    "historicalWithdrawals",
    "hour_of_day",
    "last_hop_risk",
    "account_in_known_ring",
]

rows, labels, groups, case_ref = [], [], [], []
for case in cases:
    for cand in case["candidates"]:
        rows.append([float(cand[f]) if not isinstance(cand[f], bool) else float(cand[f])
                     for f in FEATURES])
        labels.append(1 if cand["is_actual_cashout"] else 0)
        groups.append(case["id"])
        case_ref.append(case["id"])

X = np.array(rows)
y = np.array(labels)
groups = np.array(groups)

# --- case-level split: 75% of cases for training, 25% held out ---
splitter = GroupShuffleSplit(n_splits=1, test_size=0.25, random_state=42)
train_idx, test_idx = next(splitter.split(X, y, groups))

X_train, X_test = X[train_idx], X[test_idx]
y_train, y_test = y[train_idx], y[test_idx]
groups_test = groups[test_idx]

model = GradientBoostingClassifier(n_estimators=150, max_depth=3, random_state=42)
model.fit(X_train, y_train)

probs_test = model.predict_proba(X_test)[:, 1]
preds_test = (probs_test >= 0.5).astype(int)

precision = precision_score(y_test, preds_test, zero_division=0)
recall = recall_score(y_test, preds_test, zero_division=0)
f1 = f1_score(y_test, preds_test, zero_division=0)
auc = roc_auc_score(y_test, probs_test)

# --- ranking evaluation: per held-out case, does the model's top pick /
#     top-3 picks match the actual cash-out ATM? ---
by_case = {}
for i, gi in enumerate(test_idx):
    cid = groups_test[i]
    by_case.setdefault(cid, []).append((probs_test[i], y_test[i]))

top1_hits, top3_hits, n_test_cases = 0, 0, 0
for cid, entries in by_case.items():
    entries.sort(key=lambda e: -e[0])
    n_test_cases += 1
    ranks_of_actual = [rank for rank, (p, lbl) in enumerate(entries, start=1) if lbl == 1]
    if ranks_of_actual and ranks_of_actual[0] == 1:
        top1_hits += 1
    if ranks_of_actual and ranks_of_actual[0] <= 3:
        top3_hits += 1

top1_accuracy = top1_hits / n_test_cases if n_test_cases else None
top3_accuracy = top3_hits / n_test_cases if n_test_cases else None

importances = dict(zip(FEATURES, [round(float(v), 3) for v in model.feature_importances_]))

results = {
    "n_cases_total": len(cases),
    "n_cases_train": len(set(groups[train_idx])),
    "n_cases_test": n_test_cases,
    "classification_metrics": {
        "precision": round(float(precision), 3),
        "recall": round(float(recall), 3),
        "f1": round(float(f1), 3),
        "roc_auc": round(float(auc), 3),
    },
    "ranking_metrics": {
        "top1_accuracy": round(top1_accuracy, 3) if top1_accuracy is not None else None,
        "top3_accuracy": round(top3_accuracy, 3) if top3_accuracy is not None else None,
        "note": "top1 = model's single best-ranked ATM matched the actual cash-out location; "
                "top3 = actual location was within the model's top 3 ranked candidates",
    },
    "feature_importances": importances,
}

with open("model_results.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"Trained on {results['n_cases_train']} cases, tested on {results['n_cases_test']} held-out cases")
print(f"Classification: precision={precision:.3f} recall={recall:.3f} f1={f1:.3f} AUC={auc:.3f}")
print(f"Ranking: top-1 accuracy={top1_accuracy:.3f}  top-3 accuracy={top3_accuracy:.3f}")
print(f"Feature importances: {importances}")
