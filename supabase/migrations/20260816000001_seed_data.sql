-- ============================================================================
-- SEED DATA (INDIAN RUPEES ₹ INR)
-- ============================================================================

-- 1. ROLES
INSERT INTO roles (id, name) VALUES 
('11111111-1111-1111-1111-111111111111', 'SUPER_ADMIN'),
('22222222-2222-2222-2222-222222222222', 'ADMIN'),
('33333333-3333-3333-3333-333333333333', 'KITCHEN_STAFF'),
('44444444-4444-4444-4444-444444444444', 'CASHIER'),
('55555555-5555-5555-5555-555555555555', 'CUSTOMER')
ON CONFLICT (name) DO NOTHING;

-- 2. PAYMENT METHODS
INSERT INTO payment_methods (id, name) VALUES
('aa111111-1111-1111-1111-111111111111', 'UPI (GPay / PhonePe / Paytm)'),
('aa222222-2222-2222-2222-222222222222', 'Credit / Debit Card'),
('aa333333-3333-3333-3333-333333333333', 'Cash at Counter'),
('aa444444-4444-4444-4444-444444444444', 'Net Banking')
ON CONFLICT (name) DO NOTHING;

-- 3. ALLERGENS
INSERT INTO allergens (id, name) VALUES
('ba111111-1111-1111-1111-111111111111', 'Dairy / Milk Products'),
('ba222222-2222-2222-2222-222222222222', 'Gluten / Wheat'),
('ba333333-3333-3333-3333-333333333333', 'Nuts / Peanuts'),
('ba444444-4444-4444-4444-444444444444', 'Mustard Seeds'),
('ba555555-5555-5555-5555-555555555555', 'Sesame')
ON CONFLICT (name) DO NOTHING;

-- 4. ORGANIZATION
INSERT INTO organizations (id, name) VALUES
('ca000000-0000-0000-0000-000000000001', 'Tech Hub Campus')
ON CONFLICT (id) DO NOTHING;

-- 5. CANTEEN
INSERT INTO canteens (id, organization_id, name) VALUES
('cb000000-0000-0000-0000-000000000001', 'ca000000-0000-0000-0000-000000000001', 'Central Food Court & Cafe')
ON CONFLICT (id) DO NOTHING;

-- 6. TABLES WITH CRYPTOGRAPHICALLY SECURE QR TOKENS
INSERT INTO tables (id, canteen_id, table_number, qr_code) VALUES
('da000001-0000-0000-0000-000000000001', 'cb000000-0000-0000-0000-000000000001', 'Table 01', 'qr_tbl_01_8fK29xQm7P7wL9a1'),
('da000002-0000-0000-0000-000000000002', 'cb000000-0000-0000-0000-000000000001', 'Table 02', 'qr_tbl_02_9gL30yRn8Q8xM0b2'),
('da000003-0000-0000-0000-000000000003', 'cb000000-0000-0000-0000-000000000001', 'Table 03', 'qr_tbl_03_0hM41zSo9R9yN1c3'),
('da000004-0000-0000-0000-000000000004', 'cb000000-0000-0000-0000-000000000001', 'Table 04', 'qr_tbl_04_1iN52aTp0S0zO2d4'),
('da000005-0000-0000-0000-000000000005', 'cb000000-0000-0000-0000-000000000001', 'Table 05', 'qr_tbl_05_2jO63bUq1T1aP3e5'),
('da000006-0000-0000-0000-000000000006', 'cb000000-0000-0000-0000-000000000001', 'Table 06', 'qr_tbl_06_3kP74cVr2U2bQ4f6'),
('da000007-0000-0000-0000-000000000007', 'cb000000-0000-0000-0000-000000000001', 'Table 07', 'qr_tbl_07_4lQ85dWs3V3cR5g7'),
('da000008-0000-0000-0000-000000000008', 'cb000000-0000-0000-0000-000000000001', 'Table 08', 'qr_tbl_08_5mR96eXt4W4dS6h8'),
('da000009-0000-0000-0000-000000000009', 'cb000000-0000-0000-0000-000000000001', 'Table 09', 'qr_tbl_09_6nS07fYu5X5eT7i9'),
('da000010-0000-0000-0000-000000000010', 'cb000000-0000-0000-0000-000000000001', 'Table 10', 'qr_tbl_10_7oT18gZv6Y6fU8j0')
ON CONFLICT (id) DO NOTHING;

-- 7. KITCHEN STATIONS
INSERT INTO kitchen_stations (id, canteen_id, name) VALUES
('ea000001-0000-0000-0000-000000000001', 'cb000000-0000-0000-0000-000000000001', 'Main Hot Kitchen'),
('ea000002-0000-0000-0000-000000000002', 'cb000000-0000-0000-0000-000000000001', 'Beverage & Juice Bar'),
('ea000003-0000-0000-0000-000000000003', 'cb000000-0000-0000-0000-000000000001', 'Chai & Snacks Counter')
ON CONFLICT (id) DO NOTHING;

-- 8. MENU CATEGORIES
INSERT INTO categories (id, canteen_id, name) VALUES
('fa000001-0000-0000-0000-000000000001', 'cb000000-0000-0000-0000-000000000001', 'South Indian Breakfast'),
('fa000002-0000-0000-0000-000000000002', 'cb000000-0000-0000-0000-000000000001', 'North Indian Meals & Thali'),
('fa000003-0000-0000-0000-000000000003', 'cb000000-0000-0000-0000-000000000001', 'Quick Bites & Evening Snacks'),
('fa000004-0000-0000-0000-000000000004', 'cb000000-0000-0000-0000-000000000001', 'Beverages, Chai & Coffee'),
('fa000005-0000-0000-0000-000000000005', 'cb000000-0000-0000-0000-000000000001', 'Desserts & Sweets')
ON CONFLICT (id) DO NOTHING;

-- 9. MENU ITEMS (Prices in Indian Rupees ₹)
INSERT INTO menu_items (id, category_id, name, description, base_price, is_available) VALUES
-- South Indian (Category 1)
('10000001-0000-0000-0000-000000000001', 'fa000001-0000-0000-0000-000000000001', 'Crispy Masala Dosa', 'Golden crispy rice crepe filled with spiced potato masala, served with 2 chutneys and sambar.', 70.00, true),
('10000002-0000-0000-0000-000000000002', 'fa000001-0000-0000-0000-000000000001', 'Idli Vada Combo', 'Steamed soft idlis (2 pcs) and crispy medu vada (1 pc) with hot lentil sambar and coconut chutney.', 55.00, true),
('10000003-0000-0000-0000-000000000003', 'fa000001-0000-0000-0000-000000000001', 'Ghee Podi Thatte Idli', 'Thick plate idli smeared with aromatic spiced gun powder (podi) and pure desi ghee.', 60.00, true),
('10000004-0000-0000-0000-000000000004', 'fa000001-0000-0000-0000-000000000001', 'Onion Rava Dosa', 'Crispy semolina crepe tempered with chopped onions, green chilies, and cumin seeds.', 80.00, true),
('10000005-0000-0000-0000-000000000005', 'fa000001-0000-0000-0000-000000000001', 'Poori Bhaji (3 Pcs)', 'Fluffy deep-fried whole wheat pooris served with lightly spiced potato kurma.', 65.00, true),

-- North Indian & Meals (Category 2)
('10000006-0000-0000-0000-000000000006', 'fa000002-0000-0000-0000-000000000002', 'Deluxe Executive Thali', 'Complete meal: Paneer Butter Masala, Dal Makhani, Dry Veg Sabzi, 3 Butter Rotis, Jeera Rice, Sweet, Curd & Salad.', 160.00, true),
('10000007-0000-0000-0000-000000000007', 'fa000002-0000-0000-0000-000000000002', 'Amritsari Chole Bhature', 'Two large crispy puffed bhaturas served with spicy authentic chickpea curry, pickled onions and chili.', 95.00, true),
('10000008-0000-0000-0000-000000000008', 'fa000002-0000-0000-0000-000000000002', 'Paneer Butter Masala Combo', 'Rich cottage cheese gravy in buttery tomato sauce served with 2 Layered Parathas & Steamed Rice.', 140.00, true),
('10000009-0000-0000-0000-000000000009', 'fa000002-0000-0000-0000-000000000002', 'Homestyle Rajma Chawal Bowl', 'Slow-cooked red kidney beans in thick gravy over fragrant basmati rice.', 85.00, true),
('10000010-0000-0000-0000-000000000010', 'fa000002-0000-0000-0000-000000000002', 'Hyderabadi Veg Dum Biryani', 'Layered basmati rice cooked with fresh seasonal vegetables and aromatic spices, served with Mirchi Ka Salan & Raita.', 120.00, true),

-- Quick Bites & Snacks (Category 3)
('10000011-0000-0000-0000-000000000011', 'fa000003-0000-0000-0000-000000000003', 'Butter Pav Bhaji', 'Spiced mashed mixed vegetable curry topped with generous butter, served with 2 toasted pavs.', 80.00, true),
('10000012-0000-0000-0000-000000000012', 'fa000003-0000-0000-0000-000000000003', 'Mumbai Vada Pav (2 Pcs)', 'Spicy potato fritter encased in a soft bread bun with dry garlic chutney and fried green chili.', 45.00, true),
('10000013-0000-0000-0000-000000000013', 'fa000003-0000-0000-0000-000000000003', 'Crispy Punjabi Samosa (2 Pcs)', 'Deep fried pastry filled with spiced potatoes and green peas, served with tamarind and mint chutney.', 35.00, true),
('10000014-0000-0000-0000-000000000003', 'fa000003-0000-0000-0000-000000000003', 'Paneer Tikka Kathi Roll', 'Grilled marinated paneer cubes rolled in flaky paratha with mint mayonnaise and sliced onions.', 85.00, true),
('10000015-0000-0000-0000-000000000003', 'fa000003-0000-0000-0000-000000000003', 'Peri Peri French Fries', 'Crispy potato fries tossed in tangy & spicy peri peri seasoning mix.', 55.00, true),

-- Beverages (Category 4)
('10000016-0000-0000-0000-000000000004', 'fa000004-0000-0000-0000-000000000004', 'Special Adrak Elaichi Chai', 'Freshly brewed hot milk tea infused with crushed ginger and aromatic green cardamom.', 20.00, true),
('10000017-0000-0000-0000-000000000004', 'fa000004-0000-0000-0000-000000000004', 'South Indian Filter Coffee', 'Traditional decoction coffee served hot and frothy in a steel dabarah set.', 25.00, true),
('10000018-0000-0000-0000-000000000004', 'fa000004-0000-0000-0000-000000000004', 'Thick Cold Coffee with Ice Cream', 'Chilled creamy blended coffee topped with a scoop of vanilla ice cream.', 65.00, true),
('10000019-0000-0000-0000-000000000004', 'fa000004-0000-0000-0000-000000000004', 'Punjabi Sweet Lassi', 'Chilled churned yogurt drink topped with malai and cardamom.', 45.00, true),
('10000020-0000-0000-0000-000000000004', 'fa000004-0000-0000-0000-000000000004', 'Fresh Lime Soda (Sweet & Salt)', 'Refreshing sparkling soda with fresh squeezed lemon juice and mint.', 35.00, true),

-- Desserts (Category 5)
('10000021-0000-0000-0000-000000000005', 'fa000005-0000-0000-0000-000000000005', 'Warm Gulab Jamun (2 Pcs)', 'Soft melt-in-mouth milk solids dumplings soaked in rose cardamom sugar syrup.', 45.00, true),
('10000022-0000-0000-0000-000000000005', 'fa000005-0000-0000-0000-000000000005', 'Kesar Pista Rasmalai (2 Pcs)', 'Delicate cottage cheese discs soaked in saffron cardamom thickened milk.', 65.00, true)
ON CONFLICT (id) DO NOTHING;

-- 10. ADDONS & CUSTOMIZATIONS
INSERT INTO menu_item_addons (id, menu_item_id, name, is_multiple, is_required) VALUES
('aa000001-0000-0000-0000-000000000001', '10000001-0000-0000-0000-000000000001', 'Dosa Add-ons', true, false),
('aa000002-0000-0000-0000-000000000011', '10000011-0000-0000-0000-000000000011', 'Pav Bhaji Add-ons', true, false),
('aa000003-0000-0000-0000-000000000006', '10000006-0000-0000-0000-000000000006', 'Thali Add-ons', true, false)
ON CONFLICT (id) DO NOTHING;

-- 11. ADDON OPTIONS (Prices in Indian Rupees ₹)
INSERT INTO menu_item_addon_options (id, addon_id, name, price_adjustment) VALUES
('ba000001-0000-0000-0000-000000000001', 'aa000001-0000-0000-0000-000000000001', 'Extra Desi Ghee', 15.00),
('ba000002-0000-0000-0000-000000000001', 'aa000001-0000-0000-0000-000000000001', 'Grated Amul Cheese', 25.00),
('ba000003-0000-0000-0000-000000000001', 'aa000001-0000-0000-0000-000000000001', 'Extra Bowl of Sambar', 15.00),
('ba000004-0000-0000-0000-000000000002', 'aa000002-0000-0000-0000-000000000011', 'Extra Pair of Butter Pav (2 Pcs)', 20.00),
('ba000005-0000-0000-0000-000000000002', 'aa000002-0000-0000-0000-000000000011', 'Extra Cheese Topping', 25.00),
('ba000006-0000-0000-0000-000000000003', 'aa000003-0000-0000-0000-000000000006', 'Extra Butter Roti', 12.00),
('ba000007-0000-0000-0000-000000000003', 'aa000003-0000-0000-0000-000000000006', 'Extra Sweet (Gulab Jamun)', 25.00)
ON CONFLICT (id) DO NOTHING;

-- 12. SYSTEM SETTINGS
INSERT INTO system_settings (id, key, value) VALUES
('55000001-0000-0000-0000-000000000001', 'canteen_info', '{"name": "Central Food Court", "currency": "INR", "currency_symbol": "₹", "tax_rate_percent": 5.0, "is_open": true}'::jsonb),
('55000002-0000-0000-0000-000000000002', 'payment_settings', '{"upi_enabled": true, "card_enabled": true, "cash_enabled": true, "upi_vpa": "canteen@upi"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
