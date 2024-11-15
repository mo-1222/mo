CREATE TABLE `users`
(
    `id` INT(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `name` VARCHAR(64) NOT NULL COMMENT '昵称',
    `email` VARCHAR(64) NOT NULL COMMENT '邮箱',
    `password` VARCHAR(64) NOT NULL COMMENT '密码',
    `token` VARCHAR(64) NOT NULL COMMENT '令牌',
    `time` DATETIME NOT NULL COMMENT '时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE = MyISAM AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;

CREATE TABLE `suggestions`
(
    `id` INT(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `email` VARCHAR(64) NOT NULL COMMENT '邮箱',
    `wd` VARCHAR(255) COMMENT '关键字简拼',
    `keyword` VARCHAR(255) COMMENT '关键字全拼',
    `suggestion` VARCHAR(255) NOT NULL COMMENT '建议',
    `language` VARCHAR(64) NOT NULL COMMENT '语言',
    `time` DATETIME NOT NULL COMMENT '时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`, `suggestion`)
) ENGINE = MyISAM AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;