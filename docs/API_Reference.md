### Canteen Menu Data (`menu_data.json`)

The `menu_data.json` file serves as a source for initial canteen menu items. Its structure defines how food items are represented within the system.

#### File Path
`backend/app/menu_data.json`

#### Structure

The file is an array of objects, where each object represents a single menu item with the following properties:

- `name`: `string` - The name of the menu item (e.g., "Samosa").
- `description`: `string` - A brief description of the item.
- `price`: `number` - The price of the item.
- `category`: `string` - A comma-separated string of categories relevant to the item (e.g., "veg", "jain", "non-veg").

```json
[
  {
    "name": "Samosa",
    "description": "Crispy pastry with spiced potato filling.",
    "price": 20.00,
    "category": "veg,jain"
  },
  {
    "name": "Chicken Biryani",
    "description": "Aromatic rice with spiced chicken.",
    "price": 150.00,
    "category": "non-veg"
  }
]
```

**Purpose**: This file is primarily used for populating the initial canteen menu in development or for demo purposes. In a production environment, menu additions and updates would typically be handled via administrative API endpoints.