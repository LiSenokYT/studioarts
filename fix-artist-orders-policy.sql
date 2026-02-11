-- Исправление политики для просмотра заказов художницей
-- Проблема: художница не видит заказы со статусом "pending" потому что artist_id еще NULL

-- Удаляем старую политику
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- Создаём новую политику
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    -- Пользователь может видеть свои заказы
    user_id = auth.uid() 
    OR 
    -- Художница может видеть заказы, где она назначена
    artist_id = auth.uid() 
    OR
    -- Художница и админ могут видеть ВСЕ заказы
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'artist' OR role = 'admin')
    )
  );
