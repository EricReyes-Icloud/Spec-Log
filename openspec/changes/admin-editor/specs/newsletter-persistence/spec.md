# Newsletter Persistence Specification

## Purpose

Firestore CRUD operations for newsletter drafts, supporting save-as-draft and load-by-id workflows from the admin editor. The `newsletters` collection schema is defined by the application layer.

## Requirements

### Requirement: Schema Definition

The system MUST use the following Firestore document schema for the `newsletters` collection:

```
title: string
markdown: string
status: "draft" | "scheduled" | "sent"
createdAt: Timestamp
updatedAt: Timestamp
```

#### Scenario: New document matches schema

- GIVEN a draft newsletter is created
- WHEN the document is written to Firestore
- THEN all required fields (`title`, `markdown`, `status`, `createdAt`, `updatedAt`) are present
- AND `status` is set to `"draft"`
- AND `createdAt` equals `updatedAt` on first save

### Requirement: Create Draft

The system MUST persist a newsletter document to the `newsletters` Firestore collection with status `"draft"`. The document SHALL use an auto-generated Firestore document ID.

#### Scenario: Save new draft

- GIVEN an admin provides a title and markdown content
- WHEN the admin clicks save
- THEN a new document is created in `newsletters`
- AND the document has a Firestore-generated ID
- AND `status` is `"draft"`
- AND `createdAt` and `updatedAt` are set to the current server timestamp
- AND the save function returns the new document ID

#### Scenario: Save without title

- GIVEN an admin provides markdown but an empty title
- WHEN the admin clicks save
- THEN the system MUST NOT create a Firestore document
- AND an error is returned indicating the title is required

### Requirement: Update Existing Draft

When saving from `/admin/editor/:id`, the system MUST update the existing document instead of creating a new one. The `updatedAt` field SHALL be refreshed while `createdAt` SHALL remain unchanged.

#### Scenario: Update existing draft

- GIVEN an admin loads newsletter `abc123` and modifies the markdown
- WHEN the admin clicks save
- THEN the document `abc123` is updated in Firestore
- AND `updatedAt` is set to the current timestamp
- AND `createdAt` is preserved from the original document
- AND `status` remains `"draft"`

#### Scenario: Update non-existent document

- GIVEN an admin loads `/admin/editor/nonexistent`
- WHEN the admin tries to save
- THEN the system MUST return a "document not found" error
- AND no new document is created

### Requirement: Load Newsletter by ID

The system MUST retrieve a newsletter document from Firestore by its document ID. The retrieved data SHALL be returned as a typed object matching the schema.

#### Scenario: Load existing newsletter

- GIVEN a newsletter exists with document ID `abc123`
- WHEN the system loads the newsletter by ID
- THEN the returned object contains `title`, `markdown`, `status`, `createdAt`, and `updatedAt`
- AND all fields match the stored document values

#### Scenario: Load non-existent newsletter

- GIVEN no document exists with the given ID
- WHEN the system attempts to load the newsletter
- THEN the system returns `null`
- AND no error is thrown

### Requirement: Error Handling

The system MUST gracefully handle Firestore errors during read and write operations. Errors SHALL be caught and surfaced as structured error objects, not thrown exceptions.

#### Scenario: Firestore write failure

- GIVEN the Firestore client cannot write (network error, permission denied)
- WHEN the admin clicks save
- THEN an error object with a human-readable message is returned
- AND the editor shows an error state
- AND the admin's content is not lost from the textarea

#### Scenario: Firestore read failure

- GIVEN the Firestore client cannot read (network error, permission denied)
- WHEN the system attempts to load a newsletter by ID
- THEN an error object with a human-readable message is returned
- AND the editor shows an error state
