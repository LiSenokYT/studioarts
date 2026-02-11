-- Миграция для добавления полей оплаты
-- Выполните этот SQL если база данных уже создана

-- Добавляем новые поля в таблицу orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS payment_rejection_reason TEXT;

-- Комментарии для документации
COMMENT ON COLUMN orders.payment_screenshot_url IS 'URL скриншота оплаты от пользователя';
COMMENT ON COLUMN orders.payment_rejection_reason IS 'Причина отклонения оплаты художницей';
