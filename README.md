# Support Tickets Viewer

A small React project that reads `ticketing_system.json` and shows the tickets on a page. I built it with Vite.

## How to run it

1. Install Node.js (version 18 or newer) if you don't have it yet.
2. Open a terminal in this folder.
3. Install the packages:

```
   npm install
```

4. Start the project:

```
   npm run dev
```

5. Open the link shown in the terminal (usually http://localhost:5173).


## What it does

- Shows each ticket's title, description, status, priority, category, who made it, who it's assigned to, and the created and due dates
- Two views: a table and cards
- Search box and filters for status, category and priority
- Sort by newest, oldest, due date or priority

## Edge cases handled

- Empty fields show text like "Unassigned" or "No due date" (the dark mode ticket has `due_date: null`)
- If the tickets list is empty, a message is shown
- If the JSON file is missing or broken, an error message is shown
- If a search finds nothing, a message is shown with a button to clear the filters

## Where the data is

The data file is `public/ticketing_system.json`. You can edit it and refresh the page to see the changes. There's also an "Open another JSON file" button at the top if you want to try a different file.

To test edge cases (empty fields, missing values), click the **Open another JSON file** button at the top of the page and choose `tickets_edge_cases.json`.

## Main files

- `src/App.jsx` - the main page
- `src/components/` - the table, the cards, the search and filter bar, and the badges
- `src/hooks/useTickets.js` - loads the JSON file
- `src/utils/tickets.js` - helper functions for dates, filtering and sorting
- `src/styles.css` - the styling