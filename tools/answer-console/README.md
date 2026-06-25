# Answer Engine POC console

A hands-on proof of concept of the ANSWER-003 founder-operated loop. Open
`index.html` in any browser. No server, no keys, fully offline.

It is the place to **test the product as a user**: pick a question, watch the
chain run, read the answer, verify canon, and watch the publish verdict change.

## How to use it

1. **Open** `tools/answer-console/index.html` in a browser.
2. **Pick a sample question** (two are pre-run) or type your own.
3. **Run the chain.** The stages reveal in order: Demand Researcher, Question
   Definer, Brief Writer, Answer Writer, Fact-Checker, Editorial Validator. The
   answer renders below.
4. **Read the verdict** (right panel). With seed canon, both samples **hold**,
   because every cited stat is still a candidate. That is correct, not a bug.
5. **Verify a fact.** In the Canon panel, click a candidate pill to flip it to
   verified. The verdict recomputes instantly.

## The happy-path demo

Pick the second sample, *"does crossing $100 in sales change whether a coach
sticks around."* It cites `ret-100gmv`, which already carries a complete
verification record (definition, query_ref, sample_n, as_of). It holds at first.
Click the `ret-100gmv` pill to verified. The verdict flips to **auto-publish**.
That is the whole ANSWER-003 loop in two clicks: hold, verify, green.

The first sample (*"why do members go quiet"*) cites three EDA facts whose records
are not yet filled in, so it keeps holding even if you flip the pill: the console
asks you to confirm, and the Fact-Checker still fails an incomplete record. That
shows the guardrail: a status flip alone is not enough, the record must be real.

## Running your own question

The two samples are pre-run so the POC works offline. For any other question, run
it in Claude (the `answer-factory` skill, or "run the answer factory on: your
question"), then paste the finished answer markdown into the paste panel. The
console fact-checks it against the current canon and emits a verdict.

## What is real vs demo

- **Real:** the canon, the verification-record rules, the fact-check, the verdict
  logic, the copy-rule checks, export. These match the agents and ANSWER-002/003.
- **Demo:** the two sample runs are pre-baked (the chain output is canned) so the
  POC needs no live model. Real generation happens in Claude; paste the result.

This console shares its canon and verdict logic with `tools/canon-console/`. The
canon edits here are a working copy in browser storage, not written back to the
repo. Reset returns to the seed.
