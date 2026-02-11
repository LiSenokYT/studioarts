# 📊 Полезные SQL запросы

## 👥 Управление пользователями

### Назначить роль художницы
\`\`\`sql
UPDATE profiles 
SET role = 'artist' 
WHERE email = 'artist@example.com';
\`\`\`

### Назначить роль администратора
\`\`\`sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
\`\`\`

### Заблокировать пользователя
\`\`\`sql
UPDATE profiles 
SET is_banned = true 
WHERE email = 'user@example.com';
\`\`\`

### Разблокировать пользователя
\`\`\`sql
UPDATE profiles 
SET is_banned = false 
WHERE email = 'user@example.com';
\`\`\`

### Посмотреть всех пользователей
\`\`\`sql
SELECT 
  email,
  full_name,
  role,
  is_banned,
  created_at
FROM profiles
ORDER BY created_at DESC;
\`\`\`

### Посмотреть всех художниц
\`\`\`sql
SELECT 
  email,
  full_name,
  created_at
FROM profiles
WHERE role = 'artist';
\`\`\`

### Удалить пользователя (осторожно!)
\`\`\`sql
DELETE FROM profiles 
WHERE email = 'user@example.com';
\`\`\`

## 📦 Управление заказами

### Посмотреть все заказы
\`\`\`sql
SELECT 
  o.id,
  o.title,
  o.status,
  o.price,
  u.email as user_email,
  a.email as artist_email,
  o.created_at
FROM orders o
LEFT JOIN profiles u ON o.user_id = u.id
LEFT JOIN profiles a ON o.artist_id = a.id
ORDER BY o.created_at DESC;
\`\`\`

### Посмотреть заказы по статусу
\`\`\`sql
SELECT 
  title,
  description,
  price,
  created_at
FROM orders
WHERE status = 'pending'
ORDER BY created_at DESC;
\`\`\`

### Посмотреть заказы пользователя
\`\`\`sql
SELECT 
  title,
  status,
  price,
  created_at
FROM orders
WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'user@example.com'
)
ORDER BY created_at DESC;
\`\`\`

### Изменить статус заказа
\`\`\`sql
UPDATE orders 
SET status = 'completed' 
WHERE id = 'order_id_here';
\`\`\`

### Отменить заказ
\`\`\`sql
UPDATE orders 
SET status = 'cancelled' 
WHERE id = 'order_id_here';
\`\`\`

### Удалить заказ (осторожно!)
\`\`\`sql
DELETE FROM orders 
WHERE id = 'order_id_here';
\`\`\`

### Статистика по заказам
\`\`\`sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(price) as total_price
FROM orders
GROUP BY status
ORDER BY count DESC;
\`\`\`

### Заказы за последний месяц
\`\`\`sql
SELECT 
  COUNT(*) as total_orders,
  SUM(price) as total_revenue
FROM orders
WHERE created_at >= NOW() - INTERVAL '1 month';
\`\`\`

## 🎨 Управление галереей

### Посмотреть все работы
\`\`\`sql
SELECT 
  g.title,
  g.description,
  p.email as created_by,
  g.created_at
FROM gallery_items g
LEFT JOIN profiles p ON g.created_by = p.id
ORDER BY g.created_at DESC;
\`\`\`

### Добавить работу в галерею
\`\`\`sql
INSERT INTO gallery_items (
  title,
  description,
  image_url,
  created_by
) VALUES (
  'Название работы',
  'Описание работы',
  'https://example.com/image.jpg',
  (SELECT id FROM profiles WHERE email = 'artist@example.com')
);
\`\`\`

### Удалить работу из галереи
\`\`\`sql
DELETE FROM gallery_items 
WHERE id = 'item_id_here';
\`\`\`

### Обновить работу
\`\`\`sql
UPDATE gallery_items 
SET 
  title = 'Новое название',
  description = 'Новое описание'
WHERE id = 'item_id_here';
\`\`\`

## 💬 Управление сообщениями

### Посмотреть сообщения заказа
\`\`\`sql
SELECT 
  m.content,
  p.email as sender,
  m.created_at
FROM messages m
LEFT JOIN profiles p ON m.sender_id = p.id
WHERE m.order_id = 'order_id_here'
ORDER BY m.created_at ASC;
\`\`\`

### Удалить сообщение
\`\`\`sql
DELETE FROM messages 
WHERE id = 'message_id_here';
\`\`\`

### Очистить чат заказа
\`\`\`sql
DELETE FROM messages 
WHERE order_id = 'order_id_here';
\`\`\`

### Количество сообщений по заказам
\`\`\`sql
SELECT 
  o.title,
  COUNT(m.id) as message_count
FROM orders o
LEFT JOIN messages m ON o.id = m.order_id
GROUP BY o.id, o.title
ORDER BY message_count DESC;
\`\`\`

## ⭐ Управление отзывами

### Посмотреть все отзывы
\`\`\`sql
SELECT 
  t.content,
  t.rating,
  t.is_approved,
  p.email as user_email,
  t.created_at
FROM testimonials t
LEFT JOIN profiles p ON t.user_id = p.id
ORDER BY t.created_at DESC;
\`\`\`

### Одобрить отзыв
\`\`\`sql
UPDATE testimonials 
SET is_approved = true 
WHERE id = 'testimonial_id_here';
\`\`\`

### Отклонить отзыв
\`\`\`sql
UPDATE testimonials 
SET is_approved = false 
WHERE id = 'testimonial_id_here';
\`\`\`

### Удалить отзыв
\`\`\`sql
DELETE FROM testimonials 
WHERE id = 'testimonial_id_here';
\`\`\`

### Средний рейтинг
\`\`\`sql
SELECT 
  AVG(rating) as average_rating,
  COUNT(*) as total_reviews
FROM testimonials
WHERE is_approved = true;
\`\`\`

## 📊 Аналитика и статистика

### Общая статистика
\`\`\`sql
SELECT 
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM orders) as total_orders,
  (SELECT COUNT(*) FROM gallery_items) as total_gallery_items,
  (SELECT COUNT(*) FROM testimonials WHERE is_approved = true) as approved_reviews;
\`\`\`

### Топ пользователей по заказам
\`\`\`sql
SELECT 
  p.email,
  p.full_name,
  COUNT(o.id) as order_count,
  SUM(o.price) as total_spent
FROM profiles p
LEFT JOIN orders o ON p.id = o.user_id
GROUP BY p.id, p.email, p.full_name
ORDER BY order_count DESC
LIMIT 10;
\`\`\`

### Доход по месяцам
\`\`\`sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as orders_count,
  SUM(price) as revenue
FROM orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month DESC;
\`\`\`

### Конверсия заказов
\`\`\`sql
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM orders
GROUP BY status
ORDER BY count DESC;
\`\`\`

## 🧹 Очистка данных

### Удалить все тестовые данные (ОСТОРОЖНО!)
\`\`\`sql
-- Удалить все сообщения
DELETE FROM messages;

-- Удалить все заказы
DELETE FROM orders;

-- Удалить все работы из галереи
DELETE FROM gallery_items;

-- Удалить все отзывы
DELETE FROM testimonials;

-- НЕ удаляйте profiles, если хотите сохранить пользователей!
\`\`\`

### Сбросить автоинкремент (если нужно)
\`\`\`sql
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE messages_id_seq RESTART WITH 1;
\`\`\`

## 🔍 Поиск и фильтрация

### Поиск заказов по ключевому слову
\`\`\`sql
SELECT 
  title,
  description,
  status
FROM orders
WHERE 
  title ILIKE '%портрет%' OR 
  description ILIKE '%портрет%'
ORDER BY created_at DESC;
\`\`\`

### Заказы в определенном ценовом диапазоне
\`\`\`sql
SELECT 
  title,
  price,
  status
FROM orders
WHERE price BETWEEN 1000 AND 5000
ORDER BY price DESC;
\`\`\`

### Заказы за определенный период
\`\`\`sql
SELECT 
  title,
  status,
  created_at
FROM orders
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'
ORDER BY created_at DESC;
\`\`\`

## 🔧 Обслуживание

### Проверить размер таблиц
\`\`\`sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
\`\`\`

### Проверить активные подключения
\`\`\`sql
SELECT 
  datname,
  usename,
  application_name,
  client_addr,
  state
FROM pg_stat_activity
WHERE datname = current_database();
\`\`\`

### Вакуум таблиц (оптимизация)
\`\`\`sql
VACUUM ANALYZE profiles;
VACUUM ANALYZE orders;
VACUUM ANALYZE messages;
\`\`\`

## 💾 Бэкап и восстановление

### Экспорт данных в CSV
\`\`\`sql
COPY (
  SELECT * FROM orders
) TO '/tmp/orders_backup.csv' WITH CSV HEADER;
\`\`\`

### Создать бэкап таблицы
\`\`\`sql
CREATE TABLE orders_backup AS 
SELECT * FROM orders;
\`\`\`

### Восстановить из бэкапа
\`\`\`sql
INSERT INTO orders 
SELECT * FROM orders_backup;
\`\`\`

---

## ⚠️ Важные замечания

1. **Всегда делайте бэкап** перед выполнением DELETE или UPDATE
2. **Используйте WHERE** в UPDATE и DELETE запросах
3. **Проверяйте запросы** сначала с SELECT
4. **RLS политики** могут ограничивать результаты
5. **Используйте транзакции** для критичных операций:

\`\`\`sql
BEGIN;
-- ваши запросы
COMMIT; -- или ROLLBACK; для отмены
\`\`\`

---

Эти запросы помогут вам управлять проектом через SQL Editor в Supabase! 🚀
