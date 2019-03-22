
-- 查询表结构
-- select column_name, column_type, ordinal_position from information_schema.columns where table_schema ='staff_manager' and table_name = 't_staff';

-- desc information_schema.columns;


select * from information_schema.columns where table_schema ='staff_manager' and table_name = 't_staff' order by ordinal_position;
