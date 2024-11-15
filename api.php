<?php
        use PHPMailer\PHPMailer\PHPMailer;
        require 'php/PHPMailer.php';
        require 'php/SMTP.php';

        if($_SERVER['REQUEST_METHOD'] === 'POST')
        {
            $db = mysqli_connect('', '', '', '');
            mysqli_query($db, 'set names utf8');

            function info($state)
            {
                $info = [
                            201 => '您的邮箱未注册，请注册！',
                            202 => '您输入的密码不匹配，请重新输入！',
                            203 => '您的邮箱已注册，请登录！',
                            204 => '验证码发送成功！',
                            205 => '验证码发送失败！',
                            206 => '您输入的验证码不匹配，请重新输入！',
                            207 => '您的信息已过期，请重新登录！',
                            208 => '您的账号不存在！'
                        ];
                if(array_key_exists($state, $info))
                {
                    return $info[$state];
                }
            }
            function token()
            {
                $token = '';
                $string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for($i = 0; $i < 32; $i++)
                {
                    $token .= $string[rand(0, strlen($string) - 1)];
                }
                return $token;
            }

            $action = $_POST['action'];
            if($action === 'login')
            {
                $email = $_POST['email'];
                $password = $_POST['password'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if(password_verify($password, $row['password']))
                    {
                        $engine = mysqli_fetch_assoc(mysqli_query($db, "SELECT * FROM engines WHERE email = '$email'"));
                        $wallpaper = mysqli_query($db, "SELECT * FROM wallpapers WHERE email = '$email'");
                        $sites = [];
                        $arr = mysqli_query($db, "SELECT id, title, link, icon, attr, color, sort FROM sites WHERE email = '$email' ORDER BY id");
                        while($rows = mysqli_fetch_assoc($arr))
                        {
                            $sites[] = $rows;
                        }

                        $data['data']['user'] = ['name' => $row['name'], 'email' => $row['email'], 'token' => $row['token']];
                        $data['data']['engine'] = $engine['engine'];
                        if(mysqli_num_rows($wallpaper) === 1)
                        {
                            $row = mysqli_fetch_assoc($wallpaper);
                            $data['data']['wallpaper'] = $row['wallpaper'];
                        }
                        $data['data']['sites'] = $sites;
                    }
                    else
                    {
                        $data['info'] = info($state = 202);
                    }
                }
                else
                {
                    $data['info'] = info($state = 201);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'register')
            {
                $name = $_POST['name'];
                $email = $_POST['email'];
                $password = $_POST['password'];
                $engine = $_POST['engine'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $data['info'] = info($state = 203);
                }
                else
                {
                    $password = password_hash($password, PASSWORD_DEFAULT);
                    $token = token();

                    mysqli_query($db, "INSERT INTO users(name, email, password, token, time) VALUES('$name', '$email', '$password', '$token', NOW())");
                    mysqli_query($db, "INSERT INTO engines(email, engine, time) VALUES('$email', '$engine', NOW())");

                    $data['data']['user'] = ['name' => $name, 'email' => $email, 'token' => $token];
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'messages')
            {
                $newName = $_POST['newName'];
                $newEmail = $_POST['newEmail'];
                $newPassword = $_POST['newPassword'];
                $oldEmail = $_POST['oldEmail'];
                $oldToken = $_POST['oldToken'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$oldEmail'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($oldToken === $row['token'])
                    {
                        $password = password_hash($newPassword, PASSWORD_DEFAULT);
                        $token = token();

                        if($newPassword === '')
                        {
                            mysqli_query($db, "UPDATE users SET name = '$newName', email = '$newEmail', token = '$token' WHERE email = '$oldEmail'");
                        }
                        else
                        {
                            mysqli_query($db, "UPDATE users SET name = '$newName', email = '$newEmail', password = '$password', token = '$token' WHERE email = '$oldEmail'");
                        }
                        mysqli_query($db, "UPDATE engines SET email = '$newEmail' WHERE email = '$oldEmail'");
                        mysqli_query($db, "UPDATE wallpapers SET email = '$newEmail' WHERE email = '$oldEmail'");
                        mysqli_query($db, "UPDATE sites SET email = '$newEmail' WHERE email = '$oldEmail'");

                        $data['data']['user'] = ['name' => $newName, 'email' => $newEmail, 'token' => $token];
                    }
                    else
                    {
                        $data['info'] = info($state = 207);
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'captcha')
            {
                $email = $_POST['email'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    $captcha = rand(100000, 999999);
                    $body = '
                                <div style="width: 100%; padding: 60px 0; background-color: #efeeee; font-weight: 700; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                                        <div style="width: 460px; padding: 30px; background-color: rgba(255,255,255, .5); border-radius: 20px; box-sizing: border-box;">
                                                <div>您好，'.$row['name'].'</div>
                                                <div>您正在进行重置密码操作，您的验证码是：</div>
                                                <div style="padding: 60px 0; text-align: center; font-size: 60px; color: #ff6f66;">'.$captcha.'</div>
                                                <div style="font-size: 14px;">注意：此邮件只用于重置密码，如非本人操作请忽略此邮件</div>
                                        </div>
                                </div>
                            ';

                    $mail = new PHPMailer(true);
                    $mail -> CharSet = "UTF-8";
                    $mail -> SMTPDebug = 0;
                    $mail -> isSMTP();
                    $mail -> SMTPAuth = true;
                    $mail -> Host = '';
                    $mail -> Username = '';
                    $mail -> Password = '';
                    $mail -> SMTPSecure = '';
                    $mail -> Port = ;
                    $mail -> setFrom('', '');
                    $mail -> addAddress($email, $row['name']);
                    $mail -> isHTML(true);
                    $mail -> Subject = '重置密码';
                    $mail -> Body = $body;
                    if(!$mail -> send())
                    {
                        $data['info'] = info($state = 205);
                    }
                    else
                    {
                        $data['info'] = info($state = 204);
                    }

                    $sql = mysqli_query($db, "SELECT * FROM captchas WHERE email = '$email'");
                    if(mysqli_num_rows($sql) === 1)
                    {
                        mysqli_query($db, "UPDATE captchas SET captcha = '$captcha', time = NOW() WHERE email = '$email'");
                    }
                    else
                    {
                        mysqli_query($db, "INSERT INTO captchas(email, captcha, time) VALUES('$email', '$captcha', NOW())");
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'password')
            {
                $email = $_POST['email'];
                $password = $_POST['password'];
                $captcha = $_POST['captcha'];

                $sql = mysqli_query($db, "SELECT * FROM captchas WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($captcha === $row['captcha'])
                    {
                        $password = password_hash($password, PASSWORD_DEFAULT);
                        $token = token();

                        mysqli_query($db, "UPDATE users SET password = '$password', token = '$token' WHERE email = '$email'");
                        mysqli_query($db, "DELETE FROM captchas WHERE email = '$email'");

                        $user = mysqli_fetch_assoc(mysqli_query($db, "SELECT * FROM users WHERE email = '$email'"));
                        $engine = mysqli_fetch_assoc(mysqli_query($db, "SELECT * FROM engines WHERE email = '$email'"));
                        $wallpaper = mysqli_query($db, "SELECT * FROM wallpapers WHERE email = '$email'");
                        $sites = [];
                        $arr = mysqli_query($db, "SELECT id, title, link, icon, attr, color, sort FROM sites WHERE email = '$email' ORDER BY id");
                        while($rows = mysqli_fetch_assoc($arr))
                        {
                            $sites[] = $rows;
                        }

                        $data['data']['user'] = ['name' => $user['name'], 'email' => $user['email'], 'token' => $user['token']];
                        $data['data']['engine'] = $engine['engine'];
                        if(mysqli_num_rows($wallpaper) === 1)
                        {
                            $row = mysqli_fetch_assoc($wallpaper);
                            $data['data']['wallpaper'] = $row['wallpaper'];
                        }
                        $data['data']['sites'] = $sites;
                    }
                    else
                    {
                        $data['info'] = info($state = 206);
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'logout')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        $sql = mysqli_query($db, "SELECT * FROM wallpapers WHERE email = '$email'");

                        mysqli_query($db, "DELETE FROM users WHERE email = '$email'");
                        mysqli_query($db, "DELETE FROM engines WHERE email = '$email'");
                        mysqli_query($db, "DELETE FROM wallpapers WHERE email = '$email'");
                        if(mysqli_num_rows($sql) === 1)
                        {
                            $row = mysqli_fetch_assoc($sql);
                            unlink($row['wallpaper']);
                        }
                        mysqli_query($db, "DELETE FROM sites WHERE email = '$email'");

                        $data['status'] = 'success';
                    }
                    else
                    {
                        $data['info'] = info($state = 207);
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'engine')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];
                $engine = $_POST['engine'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        mysqli_query($db, "UPDATE engines SET engine = '$engine' WHERE email = '$email'");

                        $data['data']['engine'] = $engine;
                    }
                    else
                    {
                        $data['info'] = info($state = 207);
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'wallpaper')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];
                $wallpaper = $_POST['wallpaper'];
                $suffix = $_POST['suffix'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        $base64 = explode(';base64,', $wallpaper);
                        $picture = base64_decode($base64[1]);
                        $location = 'upload/'.$email.'_'.rand(10000000000000, 99999999999999).'.'.$suffix;

                        $sql = mysqli_query($db, "SELECT * FROM wallpapers WHERE email = '$email'");
                        if(mysqli_num_rows($sql) === 1)
                        {
                            mysqli_query($db, "UPDATE wallpapers SET wallpaper = '$location' WHERE email = '$email'");

                            $row = mysqli_fetch_assoc($sql);
                            unlink($row['wallpaper']);
                            file_put_contents($location, $picture);

                            $data['data']['wallpaper'] = $location;
                        }
                        else
                        {
                            mysqli_query($db, "INSERT INTO wallpapers(email, wallpaper, time) VALUES('$email', '$location', NOW())");

                            file_put_contents($location, $picture);

                            $data['data']['wallpaper'] = $location;
                        }
                    }
                    else
                    {
                        $data['info'] = info($state = 207);
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'clear')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        $sql = mysqli_query($db, "SELECT * FROM wallpapers WHERE email = '$email'");

                        mysqli_query($db, "DELETE FROM wallpapers WHERE email = '$email'");
                        if(mysqli_num_rows($sql) === 1)
                        {
                            $row = mysqli_fetch_assoc($sql);
                            unlink($row['wallpaper']);
                        }

                        $data['status'] = 'success';
                    }
                    else
                    {
                        $data['info'] = info($state = 207);
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'add')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];
                $unique = $_POST['unique'];
                $title = $_POST['title'];
                $link = $_POST['link'];
                $icon = $_POST['icon'];
                $attr = $_POST['attr'];
                $color = $_POST['color'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        $sql = mysqli_query($db, "SELECT * FROM sites WHERE id = '$unique' AND email = '$email'");
                        $row = mysqli_fetch_assoc(mysqli_query($db, "SELECT COUNT(*) AS total FROM sites WHERE email = '$email'"));
                        $total = $row['total'] + 1;
                        if(mysqli_num_rows($sql) === 1)
                        {
                            mysqli_query($db, "UPDATE sites SET title = '$title', link = '$link', icon = '$icon', attr = '$attr', color = '$color' WHERE id = '$unique' AND email = '$email'");
                        }
                        else
                        {
                            mysqli_query($db, "INSERT INTO sites(email, title, link, icon, attr, color, sort, time) VALUES('$email', '$title', '$link', '$icon', '$attr', '$color', '$total', NOW())");
                        }

                        $sites = [];
                        $arr = mysqli_query($db, "SELECT id, title, link, icon, attr, color, sort FROM sites WHERE email = '$email' ORDER BY id");
                        while($rows = mysqli_fetch_assoc($arr))
                        {
                            $sites[] = $rows;
                        }

                        $data['data']['sites'] = $sites;
                    }
                    else
                    {
                        $data['info'] = info($state = 207);
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'sort')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];
                $unique = $_POST['unique'];
                $newIndex = $_POST['newIndex'];
                $oldIndex = $_POST['oldIndex'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        $sites = [];
                        $arr = mysqli_query($db, "SELECT * FROM sites WHERE email = '$email' ORDER BY sort");
                        while($rows = mysqli_fetch_assoc($arr))
                        {
                            $sites[] = $rows;
                        }
                        $toMoveRow = $sites[$oldIndex];
                        if($unique === $toMoveRow['id'])
                        {
                            array_splice($sites, $oldIndex, 1);
                            array_splice($sites, $newIndex, 0, [$toMoveRow]);
                            foreach($sites as $index => $site)
                            {
                                $sort = $index + 1;

                                if(!mysqli_query($db, "UPDATE sites SET sort = '$sort' WHERE id = '{$site['id']}' AND email = '$email'"))
                                {
                                    $data['info'] = '更新排序失败，请重新登录！';
                                    break;
                                }
                            }

                            $sites = [];
                            $arr = mysqli_query($db, "SELECT id, title, link, icon, attr, color, sort FROM sites WHERE email = '$email' ORDER BY id");
                            while($rows = mysqli_fetch_assoc($arr))
                            {
                                $sites[] = $rows;
                            }

                            $data['data']['sites'] = $sites;
                        }
                        else
                        {
                            $data['info'] = '拖拽排序对象ID不匹配，请重新登录！';
                        }
                    }
                    else
                    {
                        $data['info'] = info($state = 207);
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'del')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];
                $unique = $_POST['unique'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        mysqli_query($db, "DELETE FROM sites WHERE id = '$unique' AND email = '$email'");

                        $sites = [];
                        $arr = mysqli_query($db, "SELECT id, title, link, icon, attr, color, sort FROM sites WHERE email = '$email' ORDER BY id");
                        while($rows = mysqli_fetch_assoc($arr))
                        {
                            $sites[] = $rows;
                        }

                        $data['data']['sites'] = $sites;
                    }
                    else
                    {
                        $data['info'] = info($state = 207);
                    }
                }
                else
                {
                    $data['info'] = info($state = 208);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'TitleIcon')
            {
                $link = $_POST['link'];

                $page = file_get_contents($link);
                $title = preg_match('/<title[^>]*>(.*?)<\/title>/ims', $page, $matches) ? $matches[1] : null;
                $icon = preg_match('/<link[^>]*rel=(["\']?)((shortcut )?icon)\1[^>]*href=(["\'])(.*?)\4/i', $page, $matches) ? $matches[5] : null;

                $data['data']['title'] = $title;
                $data['data']['icon'] = $icon;

                echo json_encode($data);
                return false;
            }
        }
?>