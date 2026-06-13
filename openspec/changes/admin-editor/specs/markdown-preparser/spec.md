# Markdown Pre-parser Specification

## Purpose

A client-side transformation layer that converts custom `<coment>` and `<heading>` tags into standard HTML elements before react-markdown processing, enabling editorial metadata and emphasis shortcuts without modifying the markdown parser itself.

## Requirements

### Requirement: Comment Tag Transformation

The pre-parser MUST replace `<coment>text</coment>` with a `<span>` styled as a smaller, muted metadata line. The transformation MUST occur client-side before react-markdown renders.

#### Scenario: Basic comment conversion

- GIVEN markdown input contains `<coment>Draft v2 — review pending</coment>`
- WHEN the pre-parser processes the input
- THEN the output contains `<span class="coment-line">Draft v2 — review pending</span>`
- AND the rendered element is smaller and muted compared to body text

#### Scenario: Comment with inline markdown

- GIVEN markdown input contains `<coment>Reviewed by **John**</coment>`
- WHEN the pre-parser processes the input
- THEN the inner markdown formatting SHALL still be processed by react-markdown
- AND the surrounding `<span class="coment-line">` wrapper is preserved

#### Scenario: Unclosed comment tag

- GIVEN markdown input contains `<coment>incomplete text` without closing tag
- WHEN the pre-parser processes the input
- THEN the input SHALL remain unchanged
- AND react-markdown renders the raw text as-is

#### Scenario: Empty comment tag

- GIVEN markdown input contains `<coment></coment>`
- WHEN the pre-parser processes the input
- THEN the tag SHALL render as an empty `<span class="coment-line"></span>`
- AND no extraneous whitespace is added

### Requirement: Heading Tag Transformation

The pre-parser MUST replace `<heading>text</heading>` with an `<h2>` element styled at a larger font size. The transformation MUST occur before react-markdown processing.

#### Scenario: Basic heading conversion

- GIVEN markdown input contains `<heading>Newsletter Title</heading>`
- WHEN the pre-parser processes the input
- THEN the output contains `<h2>Newsletter Title</h2>`
- AND the rendered text is larger than body text

#### Scenario: Heading with nested bold

- GIVEN markdown input contains `<heading>**Important** Update</heading>`
- WHEN the pre-parser processes the input
- THEN the inner `**Important**` SHALL still be processed by react-markdown
- AND the outer `<h2>` wrapper is preserved

#### Scenario: Unclosed heading tag

- GIVEN markdown input contains `<heading>incomplete` without closing tag
- WHEN the pre-parser processes the input
- THEN the input SHALL remain unchanged
- AND react-markdown renders the raw text as-is

### Requirement: Pre-parser Ordering

The pre-parser MUST process custom tags BEFORE react-markdown receives the input. Pre-parsing SHALL be a pure function — no side effects, no DOM access, no network calls.

#### Scenario: Full pipeline order

- GIVEN markdown input with `<coment>` and `<heading>` tags
- WHEN the editor processes a keystroke
- THEN the pre-parser runs first and converts tags
- THEN react-markdown receives already-transformed input
- AND no raw custom tags appear in the final render

#### Scenario: Purity of transform

- GIVEN markdown input containing custom tags
- WHEN the pre-parser runs
- THEN the original input is not mutated
- AND calling the function twice with the same input produces identical output
