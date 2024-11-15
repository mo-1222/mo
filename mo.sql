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

CREATE TABLE `captchas`
(
    `id` INT(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `email` VARCHAR(64) NOT NULL COMMENT '邮箱',
    `captcha` VARCHAR(64) NOT NULL COMMENT '验证码',
    `time` DATETIME NOT NULL COMMENT '时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`, `captcha`)
) ENGINE = MyISAM AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;

CREATE TABLE `engines`
(
    `id` INT(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `email` VARCHAR(64) NOT NULL COMMENT '邮箱',
    `engine` VARCHAR(255) NOT NULL COMMENT '引擎',
    `time` DATETIME NOT NULL COMMENT '时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`, `engine`)
) ENGINE = MyISAM AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;

CREATE TABLE `wallpapers`
(
    `id` INT(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `email` VARCHAR(64) NOT NULL COMMENT '邮箱',
    `wallpaper` VARCHAR(255) NOT NULL COMMENT '壁纸',
    `time` DATETIME NOT NULL COMMENT '时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`, `wallpaper`)
) ENGINE = MyISAM AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;

CREATE TABLE `sites`
(
    `id` INT(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `email` VARCHAR(64) NOT NULL COMMENT '邮箱',
    `title` VARCHAR(255) NOT NULL COMMENT '标题',
    `link` VARCHAR(255) NOT NULL COMMENT '链接',
    `icon` VARCHAR(255) NOT NULL COMMENT '图标',
    `attr` VARCHAR(64) NOT NULL COMMENT '属性',
    `color` VARCHAR(64) COMMENT '颜色',
    `sort` INT(20) NOT NULL COMMENT '顺序',
    `time` DATETIME NOT NULL COMMENT '时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`, `link`)
) ENGINE = MyISAM AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;