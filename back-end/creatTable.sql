create database staff_manager;
use staff_manager;

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
`name` VARCHAR(40) NOT NULL,
`job` INT UNSIGNED NOT NULL,
`company` VARCHAR(100),
`education` SMALLINT,
`gender` CHAR(2),
`birth_year` SMALLINT,
`hometown` VARCHAR(40),
`marriage` BOOLEAN, 
`phone` VARCHAR(20),
`email` VARCHAR(100),
`qq` VARCHAR(20),
`wechat` VARCHAR(20),
`experience` TEXT,
`contact_logs` TEXT,
`create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`modify_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- alter table t_staff add constraint fk_staff_job foreign key job references t_job(id);

