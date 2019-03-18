
CREATE TABLE IF NOT EXISTS `t_job`(
`id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(40) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into t_job(name) values("Web前端");
insert into t_job(name) values("Java后台");
insert into t_job(name) values("Andorid");
insert into t_job(name) values("IOS");
insert into t_job(name) values("测试");



CREATE TABLE IF NOT EXISTS `t_staff`(
`id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(100) NOT NULL,
`job` INT UNSIGNED NOT NULL,
`gender` CHAR(2),
`birth_year` SMALLINT,
`hometown` VARCHAR(40),
`salary` VARCHAR(40),
`marriage` BOOLEAN, 
`phone` VARCHAR(20),
`email` VARCHAR(100),
`qq` VARCHAR(20),
`wechat` VARCHAR(20),
`experience` TEXT,
`contact_logs` TEXT,
`create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
`modify_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


alter table t_staff add constraint fk_staff_job foreign key job references t_job(id);


insert into t_staff(name, job, gender, birth_year, hometown, salary, marriage, 
phone, email, qq, wechat, experience, contact_logs)
 values(
'范先生',1,'男',87,'广东',NULL,0,
'13760798503','','969853979','',
'11年本科毕业，2010.12 - 2013.07汇丰、2013.07 – 至今深圳市网新新思',
'15.1.12已经跳槽去了一家上市公司。'
);

