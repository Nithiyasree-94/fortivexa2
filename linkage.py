"""
linkage.py

Cross-case mule-account linkage: the TRL-3 proof-of-concept for the
"GNN-powered ring detection" claim on the slides. This version doesn't
train a GNN yet (that's the roadmap) -- it proves the underlying signal
is real by finding shared mule accounts across otherwise-unrelated
complaints using graph connected-components, then scores its own output
against the ground truth seeded by generate_dataset.py.

Run: python3 linkage.py
Reads:  dataset.json, ground_truth_rings.json
Writes: linkage_results.json
"""

import json
import networkx as nx

with open("dataset.json") as f:
    cases = json.load(f)

with open("ground_truth_rings.json") as f:
    ground_truth = json.load(f)

# --- Build bipartite graph: case nodes <-> mule-account identity nodes ---
G = nx.Graph()

for case in cases:
    case_node = ("case", case["id"])
    G.add_node(case_node, kind="case")
    for node in case["muleChain"]["nodes"]:
        if node["role"] == "Victim Source":
            continue  # linkage is about mule/cash-out infra, not victims
        identity = ("account", node["bank"], node["acc"])
        G.add_node(identity, kind="account")
        G.add_edge(case_node, identity)

# --- Extract connected components that span 2+ distinct cases ---
detected_rings = []
for component in nx.connected_components(G):
    case_ids = sorted({n[1] for n in component if n[0] == "case"})
    account_ids = [n for n in component if n[0] == "account"]
    if len(case_ids) >= 2:
        detected_rings.append({
            "case_ids": case_ids,
            "shared_accounts": [{"bank": a[1], "acc": a[2]} for a in account_ids],
        })

detected_rings.sort(key=lambda r: -len(r["case_ids"]))

# --- Score against ground truth ---
gt_case_sets = [frozenset(r["case_ids"]) for r in ground_truth.values()]
detected_case_sets = [frozenset(r["case_ids"]) for r in detected_rings]

exact_matches = sum(1 for gt in gt_case_sets if gt in detected_case_sets)
recall = exact_matches / len(gt_case_sets) if gt_case_sets else None

# a detected ring counts as a false positive only if it doesn't correspond
# to ANY seeded ground-truth ring at all
false_positives = sum(1 for d in detected_case_sets if d not in gt_case_sets)
precision = (
    (len(detected_case_sets) - false_positives) / len(detected_case_sets)
    if detected_case_sets else None
)

results = {
    "cases_analyzed": len(cases),
    "seeded_ground_truth_rings": len(gt_case_sets),
    "rings_detected": len(detected_rings),
    "exact_match_rings": exact_matches,
    "ring_recall": round(recall, 3) if recall is not None else None,
    "ring_precision": round(precision, 3) if precision is not None else None,
    "false_positive_rings": false_positives,
    "detected_rings": detected_rings,
}

with open("linkage_results.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"Cases analyzed: {results['cases_analyzed']}")
print(f"Seeded ground-truth rings: {results['seeded_ground_truth_rings']}")
print(f"Rings detected: {results['rings_detected']}")
print(f"Exact matches to ground truth: {results['exact_match_rings']}")
print(f"Ring recall: {results['ring_recall']}")
print(f"Ring precision: {results['ring_precision']}")
if detected_rings:
    top = detected_rings[0]
    print(f"\nExample detected ring: {len(top['case_ids'])} cases linked via "
          f"{top['shared_accounts'][0]['bank']} account {top['shared_accounts'][0]['acc']}")
    print(f"Case IDs: {top['case_ids']}")
