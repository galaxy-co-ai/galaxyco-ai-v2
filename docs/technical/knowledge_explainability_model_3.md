# GalaxyCo.ai — Knowledge & Explainability Model (3.3)

## Purpose

Define how GalaxyCo.ai ingests, stores, retrieves, and **explains** knowledge for Agents and Packs. This spec must make knowledge **approachable (Sider-inspired)**, transparent, and measurable, while meeting enterprise performance and privacy requirements.

---

## Principles

- **Human‑friendly**: Users see sources as tiles; can browse, search, and understand “what the system knows.”
- **Transparent**: Every answer includes **citations** and a rationale (why these sources, how confident).
- **Performant**: Fast retrieval, low cost; p95 retrieval stage < **500ms**.
- **Private by default**: Redaction & RBAC enforced; sensitive workspaces default to stricter modes.
- **Measurable**: Coverage, freshness, and retrieval quality tracked as KPIs.

---

## Core Concepts & Stores

- **Source**: A connected data origin (Google Drive, Notion, URLs, PDFs, Slack, etc.).
- **Document**: A file/page within a Source; may have versions.
- **Chunk**: A retrievable unit (text block with metadata); optimized for overlap and semantic coherence.
- **Index**: Embedding/vector space per workspace; may be sharded by Source or domain.
- **Coverage**: What topics/entities are present and how completely they’re represented.
- **Provenance**: Trace from answer → chunk → document → source with timestamps and authorship.

---

## Object Shapes (Minimum Fields)

**Source**

```
source {
  id, type, name, status {connected, indexing, error},
  auth_scope, last_sync_at, error_log[], pii_policy,
}
```

**Document**

```
document {
  id, source_id, title, uri, mime, version, created_at, updated_at,
  hash, word_count, pii_flags[], owner, permissions
}
```

**Chunk**

```
chunk {
  id, document_id, source_id, text, tokens,
  position {page, section, offset},
  embedding {model, vector_id},
  meta {language, headings[], entities[], pii_flags[]},
  recency {doc_updated_at, first_seen_at}
}
```

**Citation**

```
citation {
  chunk_id, document_id, source_id, title, uri,
  locator {page, section},
  snippet, confidence
}
```

---

## Ingestion & Indexing

**Connectors**

- OAuth/API key; scoped permissions; incremental sync; webhooks where available.

**Parsing**

- Normalize to UTF‑8 text; preserve headings; extract tables as TSV when possible; capture page/section locators.

**Chunking**

- Default: 500–1000 tokens with 10–20% overlap; semantic boundary preference (headings/sentences).
- Specialized profiles (e.g., FAQs: Q/A chunks; PDFs: page‑aware).

**Embedding**

- Workspace‑wide model default with per‑Source override; record model hash.

**Indexing Jobs**

- Async; resumable; backoff on rate limits; per‑Source queues with fairness.

**PII Redaction (if sensitivity.flag = true)**

- Named entity detection for PII/PHI; store redacted view for retrieval; maintain reversible mapping only if user’s role permits.

---

## Retrieval & Ranking

**Pipeline (default)**

1. Build query from user/agent intent (keywords + semantic expansion + filters).
2. Vector similarity search (top‑k = 20, dynamic by token budget).
3. **Reranker** (cross‑encoder) to top‑m = 5.
4. **Deduplication** (same doc section) and diversity promotion (distinct sources).
5. Construct **context window** with anti‑hallucination preface and **citations** objects.

**Filters**

- By Source, Document type, recency window, language, RBAC.

**Budgeting**

- Respect token ceilings; favor high‑confidence chunks.

---

## Citations & Explainability

**Citations must include**

- Title, locator (page/section), snippet (≤ 300 chars), source icon/name, link/uri.

**Presentation**

- Inline numbered anchors [1], [2], [3] → expandable panel listing details.
- “Why these sources” note: show top features (semantic match, recency, authority signal).

**Provenance Panel**

- For each answer: show chunks used, documents, sources, timestamps, and confidence.

**Rationale Trace (optional toggle)**

- Summarized reasoning steps (no chain‑of‑thought exposure of sensitive prompts); link back to plan/steps in traces.

---

## Confidence & Quality Signals

Define a **Confidence Score (0–1)** per answer:

- `C = w1*sim + w2*rank + w3*fresh + w4*agree + w5*coverage - w6*conflict`
  - `sim`: mean semantic similarity of used chunks
  - `rank`: reranker mean score
  - `fresh`: recency factor of documents used
  - `agree`: inter‑chunk agreement (cosine among used chunks)
  - `coverage`: share of user intent terms/entities grounded in citations
  - `conflict`: penalty if contradictory sources detected
- Start with equal weights; tune via offline eval.

**Quality KPIs (workspace)**

- **RQ@k**: % queries where at least one cited chunk is judged relevant by human/golden set.
- **Coverage Index**: % of defined topics/entities present in index with ≥ N supporting chunks.
- **Freshness**: median age of cited documents for time‑sensitive intents.
- **Cite Rate**: % answers with ≥ 2 citations.

---

## Coverage Modeling & Gap Detection

**Coverage Model**

- Maintain a topic/entity graph per workspace (from docs + user intents).
- Compute **Coverage Index** per topic: `covered_chunks / required_chunks` with freshness weighting.

**Gap Signals**

- Zero‑recall queries; low confidence; frequent agent fallbacks; user “not what I needed” feedback; stale docs.

**Remediation (PAA‑assisted)**

- PAA suggests new sources to connect, requests documents from the user, or prompts for clarifications.
- PAA opens a **coverage task** with missing topics and suggested actions.

---

## Knowledge UI (Sider‑inspired)

**Sources View**

- Grid of source tiles: icon, status (connected/indexing/error), last sync, items indexed.
- Actions: Connect, Re‑sync, Troubleshoot (error details), Permissions.

**Coverage View**

- Plain‑language “What we know” with topics, % coverage, freshness, and gaps list.
- CTA: “Fix this gap” → connect sources, upload file, or request doc.

**Citations UX**

- Hover/expand to see snippet, locator, and open doc in a side panel.

**Explainability Toggle**

- “Why this answer” shows signals and confidence.

---

## Observability & Telemetry

- Events: `source_connected`, `index_started`, `index_completed`, `index_error`, `retrieval_invoked`, `rerank_scored`, `citations_emitted`, `confidence_scored`.
- Dashboards: ingestion throughput, indexing backlog, retrieval latency, RQ@k, Coverage Index, Freshness, Cite Rate.
- Alerts: indexing failures; retrieval p95 > 500ms; confidence median < threshold.

---

## Error Handling & Fallbacks

- **Index miss/empty**: show sample knowledge; prompt to connect/upload; PAA offers help.
- **Parsing failure**: log page/section; retry with alternate parser; surface to user.
- **Over‑quota**: degrade gracefully (lower top‑k) with notice; schedule re‑run.

---

## Privacy & Security

- RBAC on sources/documents/chunks; enforce at retrieval.
- Redaction modes: PII/PHI masking in chunks; reversible mapping only within permitted scopes.
- Data residency tags per source; prevent cross‑region movement if flagged.
- Access logs for every doc and chunk retrieval.

---

## Performance Budgets

- Ingestion: 2–5 MB/s per connector lane; resumable.
- Retrieval stage: p95 < 500ms prior to LLM.
- Rerank stage: p95 < 300ms for m≤5.

---

## Evaluation Harness (RAG‑Eval)

- Golden Q/A sets per workspace; monthly sampling.
- Metrics: RQ@k, citation exact match rate, answer faithfulness audits.
- Human‑in‑loop reviews for top workflows.

---

## V1 Acceptance Criteria

- Sources View and Coverage View implemented (tiles + percentages + gaps list).
- End‑to‑end citations attached to all agent answers with title, locator, snippet, and link.
- Retrieval pipeline (vector → rerank → dedupe/diversity) operational with p95 < 500ms.
- Confidence score computed and displayed (tooltip/panel) for answers.
- PAA suggests coverage fixes when gaps are detected and can open tasks.
- RBAC and redaction enforced during retrieval; access logs visible.

---

## Non‑Goals (V1)

- Cross‑workspace global search; complex knowledge lineage visualization beyond citations; automatic external crawling without user consent.
