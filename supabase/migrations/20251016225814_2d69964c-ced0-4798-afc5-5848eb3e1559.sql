-- Função para criar usuário profissional
-- Esta função será chamada manualmente após criar o usuário via interface

-- Primeiro, vamos garantir que podemos adicionar a role de professional para novos usuários
-- A Simone deve primeiro criar uma conta em /auth com email simone@beleza.com

-- Por enquanto, vamos apenas documentar o processo e criar uma view útil
CREATE OR REPLACE VIEW professional_assignments AS
SELECT 
  p.id,
  p.full_name,
  p.phone,
  COUNT(a.id) as total_appointments,
  COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_appointments
FROM profiles p
INNER JOIN user_roles ur ON p.id = ur.user_id
LEFT JOIN appointments a ON a.professional_id = p.id
WHERE ur.role = 'professional'
GROUP BY p.id, p.full_name, p.phone;