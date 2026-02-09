# Authority Verification Trace - Test Account Structure

Test accounts used by the **insufficient weight** authority verification trace test.
These accounts form a specific authority graph that exercises cycle detection,
depth limiting, and partial weight accumulation during authority verification.

## Signing Key

| | Value |
|---|---|
| **Private (WIF)** | `5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n` |
| **Public** | `STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4` |

A single signature produced with this key is attached to the test transaction.
The key appears **only** in `authtracetst2` active authority, so only one of the
two required account-auths for `authtracetst1` can be satisfied &mdash; producing
the *insufficient weight* result.

## Authority Graph

```
authtracetst1  active  (threshold = 2)
 |
 +-- account_auth: authtracetst2  weight 1  -->  active  (threshold = 1)
 |   |
 |   +-- key_auth: STM6LLeg...  weight 1        ** matches signature **
 |
 +-- account_auth: authtracetst3  weight 1  -->  active  (threshold = 1)
     |
     +-- account_auth: authtracetst1  weight 1   ** CYCLE detected **
         |
         +-- account_auth: authtracetst2  weight 1   (depth truncated)

Accumulated weight = 1  <  threshold 2   -->   INSUFFICIENT WEIGHT

Owner fallback for authtracetst1 also fails (key does not match signature).
```

## Account Definitions

### authtracetst1

Transfer sender. Its active authority delegates to `authtracetst2` and
`authtracetst3` with threshold 2 &mdash; both must be satisfied for the
transaction to succeed.

Owner uses a **different** key (`STM8GC13...`) so the owner-fallback check
also fails, preserving the insufficient weight scenario.

```json
{
  "owner": {
    "account_auths": [],
    "key_auths": [
      ["STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX", 1]
    ],
    "weight_threshold": 1
  },
  "active": {
    "account_auths": [
      ["authtracetst2", 1],
      ["authtracetst3", 1]
    ],
    "key_auths": [],
    "weight_threshold": 2
  },
  "posting": {
    "account_auths": [],
    "key_auths": [
      ["STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4", 1]
    ],
    "weight_threshold": 1
  },
  "memo_key": "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4"
}
```

### authtracetst2

Holds the signing key in its active authority. This is the only account whose
authority is fully satisfied by the test signature.

```json
{
  "owner": {
    "account_auths": [],
    "key_auths": [
      ["STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4", 1]
    ],
    "weight_threshold": 1
  },
  "active": {
    "account_auths": [],
    "key_auths": [
      ["STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4", 1]
    ],
    "weight_threshold": 1
  },
  "posting": {
    "account_auths": [],
    "key_auths": [
      ["STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4", 1]
    ],
    "weight_threshold": 1
  },
  "memo_key": "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4"
}
```

### authtracetst3

Creates a circular dependency back to `authtracetst1`. Its active authority
delegates to `authtracetst1`, which the verifier detects as a cycle.

```json
{
  "owner": {
    "account_auths": [],
    "key_auths": [
      ["STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4", 1]
    ],
    "weight_threshold": 1
  },
  "active": {
    "account_auths": [
      ["authtracetst1", 1]
    ],
    "key_auths": [],
    "weight_threshold": 1
  },
  "posting": {
    "account_auths": [],
    "key_auths": [
      ["STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4", 1]
    ],
    "weight_threshold": 1
  },
  "memo_key": "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4"
}
```

## Verification Trace Summary

| Depth | Entry | Role | Threshold | Accumulated Weight | Result |
|:-----:|-------|------|:---------:|:------------------:|--------|
| 0 | authtracetst1 | active | 2 | 1 | insufficient weight |
| 1 | &ensp; authtracetst2 | active | 1 | 1 | accepted |
| 1 | &ensp; &ensp; `STM6LLeg...` | active | 1 | 1 | key matches signature |
| 1 | &ensp; authtracetst3 | active | 1 | 0 | insufficient weight |
| 2 | &ensp; &ensp; authtracetst1 | active | 2 | 1 | cycle + depth exceeded |
| 3 | &ensp; &ensp; &ensp; authtracetst2 | active | &mdash; | 1 | accepted (truncated) |
| 0 | authtracetst1 | owner | 1 | 0 | no matching key |
