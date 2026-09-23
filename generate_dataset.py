"""
generate_dataset.py

Builds a synthetic-but-structurally-realistic complaint dataset in the SAME
schema as server/data/complaints.json, for TRL-3 validation purposes.

Two things are deliberately seeded so we can measure real performance later:
  1. ~18% of mule accounts are REUSED across 2-4 different complaints,
     simulating an actual mule ring. linkage.py is scored against this
     known ground truth.
  2. Each complaint gets 3-5 candidate cash-out ATMs, one of which is
     marked as the historically-actual withdrawal location. model.py
     trains/evaluates against this label.

Run: python3 generate_dataset.py
Output: dataset.json  (this run's N cases)
        ground_truth_rings.json  (which case IDs share a reused mule account)
"""

import json
import random
import uuid
from datetime import datetime, timedelta

random.seed(42)

N_CASES = 120
REUSE_POOL_SIZE = 20          # number of mule accounts we deliberately reuse
REUSE_FRACTION = 0.35         # fraction of cases that draw from the reuse pool

CITIES = [
    ("Noida, UP", 28.5708, 77.3218),
    ("Mumbai, MH", 19.0760, 72.8777),
    ("Bengaluru, KA", 12.9716, 77.5946),
    ("Hyderabad, TS", 17.3850, 78.4867),
    ("Kolkata, WB", 22.5726, 88.3639),
    ("Jaipur, RJ", 26.9124, 75.7873),
    ("Lucknow, UP", 26.8467, 80.9462),
    ("Ahmedabad, GJ", 23.0225, 72.5714),
]

BANKS = ["HDFC Bank", "ICICI Bank", "SBI", "Canara Bank", "Punjab National Bank",
         "Axis Bank", "Bank of Baroda", "Kotak Mahindra Bank", "IDBI Bank"]

FRAUD_TYPES = [
    "Digital Arrest / Police Impersonation",
    "Cryptocurrency Investment Ponzi",
    "Part-time Job / YouTube Task Ponzi",
    "Electricity Bill Phishing / Fake APK",
    "Loan App Extortion & Defamation",
    "KYC Update Phishing Link",
    "Customs Parcel Extortion Scam",
    "SIM Swap & Net Banking Takeover",
]

FIRST_NAMES = ["Sunita", "Rajesh", "Priya", "Amit", "Kavita", "Suresh", "Anjali",
               "Vikram", "Deepa", "Manoj", "Neha", "Arun", "Pooja", "Sanjay"]
LAST_NAMES = ["Sharma", "Verma", "Iyer", "Reddy", "Gupta", "Nair", "Singh",
              "Patel", "Bose", "Mehta", "Rao", "Chatterjee"]


def rand_acc():
    return f"{random.randint(10000, 99999)}XXXX{random.randint(1000, 9999)}"


def rand_ifsc(bank):
    prefix = "".join(c for c in bank if c.isupper())[:4] or "BANK"
    return f"{prefix}0{random.randint(100000, 999999) % 1000000:06d}"[:11]


def jitter(lat, lng, km=3):
    d = km / 111.0
    return round(lat + random.uniform(-d, d), 4), round(lng + random.uniform(-d, d), 4)


# Build the reuse pool: fixed (bank, account, city) mule identities that will
# be sprinkled into multiple, otherwise-unrelated complaints.
reuse_pool = []
for _ in range(REUSE_POOL_SIZE):
    city_name, lat, lng = random.choice(CITIES)
    bank = random.choice(BANKS)
    reuse_pool.append({
        "bank": bank,
        "acc": rand_acc(),
        "ifsc": rand_ifsc(bank),
        "city": city_name,
    })

cases = []
ring_membership = {}  # reuse_pool index -> list of case ids that used it

base_time = datetime(2026, 9, 1, 0, 0, 0)

for i in range(N_CASES):
    case_id = f"CMP-2026-SYN{9000 + i}"
    city_name, lat, lng = random.choice(CITIES)
    victim_name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    amount = random.randint(50000, 1200000)
    fraud_type = random.choice(FRAUD_TYPES)
    complaint_time = base_time + timedelta(
        hours=random.randint(0, 24 * 25), minutes=random.randint(0, 59)
    )

    victim = {
        "name": victim_name,
        "phone": f"+91 {random.randint(70000, 99999)} XXXXX",
        "city": city_name,
        "bank": random.choice(BANKS),
        "accountNumber": rand_acc(),
        "ifsc": rand_ifsc("VICT"),
    }

    # --- build mule chain (2 to 4 hops) ---
    n_hops = random.randint(2, 4)
    nodes = [{
        "id": "V0", "label": f"{victim_name.split()[0]} (Victim)", "role": "Victim Source",
        "bank": victim["bank"], "acc": victim["accountNumber"][-8:], "risk": 5, "city": city_name
    }]
    links = []
    cur_amount = amount
    cur_time = complaint_time
    used_reuse_idx = None

    for hop in range(1, n_hops + 1):
        is_final = (hop == n_hops)
        reused_here = (not is_final) and (random.random() < REUSE_FRACTION) and (used_reuse_idx is None)

        if reused_here:
            idx = random.randrange(REUSE_POOL_SIZE)
            mule = reuse_pool[idx]
            used_reuse_idx = idx
            node_city = mule["city"]
            bank = mule["bank"]
            acc = mule["acc"]
        else:
            node_city = city_name
            bank = random.choice(BANKS)
            acc = rand_acc()

        cur_amount = round(cur_amount * random.uniform(0.82, 0.97))
        cur_time = cur_time + timedelta(minutes=random.randint(8, 90))
        risk = min(99, 40 + hop * 15 + random.randint(-5, 10))

        role = "Physical Cash Extraction" if is_final else f"Layer {hop} Mule"
        nodes.append({
            "id": f"M{hop}", "label": f"{'Target Cash-Out ATM' if is_final else 'Mule L' + str(hop)}",
            "role": role, "bank": bank, "acc": acc[-8:], "risk": risk, "city": node_city
        })
        links.append({
            "source": f"M{hop-1}" if hop > 1 else "V0",
            "target": f"M{hop}",
            "amount": cur_amount,
            "time": cur_time.strftime("%H:%M:%S"),
            "type": random.choice(["RTGS", "IMPS", "NEFT", "UPI"]),
            "txId": f"{random.choice(['RTGS','IMPS','NEFT','UPI'])}-{random.randint(100000,999999)}",
        })

        if reused_here:
            ring_membership.setdefault(used_reuse_idx, []).append(case_id)

    last_node = nodes[-1]

    # --- candidate ATM predictions (one is the real, historically-verified outcome) ---
    n_candidates = random.randint(3, 5)
    actual_idx = random.randrange(n_candidates)
    candidates = []
    for c_i in range(n_candidates):
        c_lat, c_lng = jitter(lat, lng, km=random.uniform(0.5, 6))
        dist_km = round(((c_lat - lat) ** 2 + (c_lng - lng) ** 2) ** 0.5 * 111, 2)
        hist_withdrawals = random.randint(1, 25)
        hour_of_day = cur_time.hour
        # actual candidate gets a plausible, not-too-obvious edge in the features,
        # so the model has a real (imperfect) pattern to learn, not a leak.
        if c_i == actual_idx:
            dist_km = round(dist_km * random.uniform(0.5, 0.9), 2)
            hist_withdrawals = max(hist_withdrawals, random.randint(8, 25))
        candidates.append({
            "rank": c_i + 1,
            "locationName": f"{random.choice(BANKS)} ATM - Zone {c_i+1}",
            "bank": random.choice(BANKS),
            "address": f"Zone {c_i+1}, {city_name}",
            "lat": c_lat, "lng": c_lng,
            "distance_km_from_last_hop": dist_km,
            "historicalWithdrawals": hist_withdrawals,
            "hour_of_day": hour_of_day,
            "last_hop_risk": last_node["risk"],
            "account_in_known_ring": bool(used_reuse_idx is not None),
            "is_actual_cashout": (c_i == actual_idx),
        })

    cases.append({
        "id": case_id,
        "firNumber": f"FIR/CYB/2026/{random.randint(1000,9999)}",
        "timestamp": complaint_time.isoformat() + "Z",
        "victim": victim,
        "amount": amount,
        "fraudType": fraud_type,
        "priority": random.choice(["CRITICAL", "HIGH", "MEDIUM"]),
        "status": "Pending Analysis",
        "reportedStation": f"Cyber Crime Police Station, {city_name}",
        "summary": f"Synthetic case: {fraud_type} targeting victim in {city_name}.",
        "muleChain": {"nodes": nodes, "links": links},
        "candidates": candidates,
    })

with open("dataset.json", "w") as f:
    json.dump(cases, f, indent=2)

# Ground truth: which reuse-pool identities linked which case IDs (only keep
# rings that actually ended up spanning 2+ cases, same as real fraud rings would)
ground_truth_rings = {
    f"ring_{idx}": {"account": reuse_pool[idx], "case_ids": sorted(set(case_ids))}
    for idx, case_ids in ring_membership.items()
    if len(set(case_ids)) >= 2
}

with open("ground_truth_rings.json", "w") as f:
    json.dump(ground_truth_rings, f, indent=2)

print(f"Generated {len(cases)} synthetic cases -> dataset.json")
print(f"Seeded {len(ground_truth_rings)} multi-case mule rings -> ground_truth_rings.json")
total_ring_cases = sum(len(r["case_ids"]) for r in ground_truth_rings.values())
print(f"{total_ring_cases} cases participate in a seeded cross-case ring")
