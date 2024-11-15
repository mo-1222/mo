<?php
        header("Content-Type: application/json");

        if($_SERVER['REQUEST_METHOD'] === 'POST')
        {
            $db = mysqli_connect('', '', '', '');
            mysqli_query($db, 'set names utf8');

            function info($state)
            {
                $info = [
                            201 => '您的邮箱不是管理员账号！',
                            202 => '您输入的密码不匹配，请重新输入！',
                            203 => '您的账号不存在！',
                            204 => '您的信息已过期，请重新登录！',
                            205 => 'success',
                            206 => 'failure',
                        ];
                if(array_key_exists($state, $info))
                {
                    return $info[$state];
                }
            }

            $action = $_POST['action'];
            if($action === 'login')
            {
                $email = $_POST['email'];
                $password = $_POST['password'];
                $setDataRow = $_POST['setDataRow'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if(password_verify($password, $row['password']))
                    {
                        $suggestions = [];
                        $arr = mysqli_query($db, "SELECT id, wd, keyword, suggestion, language FROM suggestions WHERE email = '$email' ORDER BY id LIMIT $setDataRow OFFSET 0");
                        while($rows = mysqli_fetch_assoc($arr))
                        {
                            $suggestions[] = $rows;
                        }
                        $totalData = mysqli_fetch_assoc(mysqli_query($db, "SELECT COUNT(*) AS totalData FROM suggestions WHERE email = '$email'"));

                        $data['data']['user'] = ['name' => $row['name'], 'email' => $row['email'], 'token' => $row['token']];
                        $data['data']['suggestions'] = $suggestions;
                        $data['data']['totalData'] = $totalData['totalData'];
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
            else if($action === 'add')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];
                $unique = $_POST['unique'];
                $wd = $_POST['wd'];
                $keyword = $_POST['keyword'];
                $suggestion = $_POST['suggestion'];
                $language = $_POST['language'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        $repeat = mysqli_query($db, "SELECT * FROM suggestions WHERE email = '$email' AND suggestion = '$suggestion'");
                        $sql = mysqli_query($db, "SELECT * FROM suggestions WHERE id = '$unique' AND email = '$email'");
                        if(mysqli_num_rows($repeat) === 1)
                        {
                            $data['info'] = '此数据已存在，请勿重复添加！';
                        }
                        else if(mysqli_num_rows($sql) === 1)
                        {
                            mysqli_query($db, "UPDATE suggestions SET wd = '$wd', keyword = '$keyword', suggestion = '$suggestion' WHERE id = '$unique' AND email = '$email'");

                            $sql = mysqli_query($db, "SELECT * FROM suggestions WHERE id = '$unique' AND suggestion = '$suggestion'");
                            $data['info'] = mysqli_num_rows($sql) === 1 ? info($state = 205) : info($state = 206);
                        }
                        else
                        {
                            mysqli_query($db, "INSERT INTO suggestions(email, wd, keyword, suggestion, language, time) VALUES('$email', '$wd', '$keyword', '$suggestion', '$language', NOW())");

                            $suggestions = [];
                            $arr = mysqli_query($db, "SELECT id, wd, keyword, suggestion, language FROM suggestions WHERE email = '$email' AND suggestion = '$suggestion'");
                            while($rows = mysqli_fetch_assoc($arr))
                            {
                                $suggestions[] = $rows;
                            }

                            $data['data']['suggestions'] = $suggestions;
                        }
                    }
                    else
                    {
                        $data['info'] = info($state = 204);
                    }
                }
                else
                {
                    $data['info'] = info($state = 203);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'query')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];
                $setDataRow = $_POST['setDataRow'];
                $wd = $_POST['wd'];
                $query = $_POST['query'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        $suggestions = [];
                        if($query === 'single')
                        {
                            $arr = mysqli_query($db, "SELECT id, wd, keyword, suggestion, language FROM suggestions WHERE email = '$email' AND wd = '$wd' OR keyword = '$wd' OR suggestion = '$wd'");
                            if(mysqli_num_rows($arr) === 1)
                            {
                                while($rows = mysqli_fetch_assoc($arr))
                                {
                                    $suggestions[] = $rows;
                                }

                                $data['data']['suggestions'] = $suggestions;
                            }
                            else
                            {
                                $data['info'] = info($state = 206);
                            }
                        }
                        else if($query === 'similar')
                        {
                            $arr = mysqli_query($db, "SELECT id, wd, keyword, suggestion, language FROM suggestions WHERE email = '$email' AND wd LIKE '$wd%' OR keyword LIKE '$wd%' OR suggestion LIKE '$wd%' ORDER BY id LIMIT $setDataRow OFFSET 0");
                            if(mysqli_num_rows($arr) > 0)
                            {
                                while($rows = mysqli_fetch_assoc($arr))
                                {
                                    $suggestions[] = $rows;
                                }
                                $totalData = mysqli_fetch_assoc(mysqli_query($db, "SELECT COUNT(*) AS totalData FROM suggestions WHERE email = '$email' AND wd LIKE '$wd%' OR keyword LIKE '$wd%' OR suggestion LIKE '$wd%'"));

                                $data['data']['suggestions'] = $suggestions;
                                $data['data']['totalData'] = $totalData['totalData'];
                            }
                            else
                            {
                                $data['info'] = info($state = 206);
                            }
                        }
                        else if($query === 'whole')
                        {
                            $arr = mysqli_query($db, "SELECT id, wd, keyword, suggestion, language FROM suggestions WHERE email = '$email' ORDER BY id LIMIT $setDataRow OFFSET 0");
                            if(mysqli_num_rows($arr) > 0)
                            {
                                while($rows = mysqli_fetch_assoc($arr))
                                {
                                    $suggestions[] = $rows;
                                }
                                $totalData = mysqli_fetch_assoc(mysqli_query($db, "SELECT COUNT(*) AS totalData FROM suggestions WHERE email = '$email'"));

                                $data['data']['suggestions'] = $suggestions;
                                $data['data']['totalData'] = $totalData['totalData'];
                            }
                            else
                            {
                                $data['info'] = info($state = 206);
                            }
                        }
                    }
                    else
                    {
                        $data['info'] = info($state = 204);
                    }
                }
                else
                {
                    $data['info'] = info($state = 203);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'del')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];
                $setDataRow = $_POST['setDataRow'];
                $currentPage = $_POST['currentPage'];
                $unique = $_POST['unique'];
                $wd = $_POST['wd'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        $id = is_array($unique) ? implode(',', $unique) : $unique;
                        $condition = is_array($unique) ? "id IN($id)" : "id = '$id'";
                        mysqli_query($db, "DELETE FROM suggestions WHERE $condition AND email = '$email'");

                        $sql = mysqli_query($db, "SELECT * FROM suggestions WHERE $condition AND email = '$email'");
                        if(mysqli_num_rows($sql) === 0)
                        {
                            $suggestions = [];
                            if($wd !== '')
                            {
                                $totalData = mysqli_fetch_assoc(mysqli_query($db, "SELECT COUNT(*) AS totalData FROM suggestions WHERE email = '$email' AND wd LIKE '$wd%' OR keyword LIKE '$wd%' OR suggestion LIKE '$wd%'"));
                                if($totalData['totalData'] !== 0)
                                {
                                    $totalPage = ceil($totalData['totalData'] / $setDataRow);
                                    $currentPage = $currentPage > $totalPage && $totalPage > 0 ? $totalPage : $currentPage;
                                    $offset = ($currentPage - 1) * $setDataRow;
                                    $arr = mysqli_query($db, "SELECT id, wd, keyword, suggestion, language FROM suggestions WHERE email = '$email' AND wd LIKE '$wd%' OR keyword LIKE '$wd%' OR suggestion LIKE '$wd%' ORDER BY id LIMIT $setDataRow OFFSET $offset");
                                    while($rows = mysqli_fetch_assoc($arr))
                                    {
                                        $suggestions[] = $rows;
                                    }

                                    $data['data']['suggestions'] = $suggestions;
                                    $data['data']['totalData'] = $totalData['totalData'];
                                    $data['data']['currentPage'] = $currentPage;
                                }
                            }
                            else
                            {
                                $totalData = mysqli_fetch_assoc(mysqli_query($db, "SELECT COUNT(*) AS totalData FROM suggestions WHERE email = '$email'"));
                                if($totalData['totalData'] !== 0)
                                {
                                    $totalPage = ceil($totalData['totalData'] / $setDataRow);
                                    $currentPage = $currentPage > $totalPage && $totalPage > 0 ? $totalPage : $currentPage;
                                    $offset = ($currentPage - 1) * $setDataRow;
                                    $arr = mysqli_query($db, "SELECT id, wd, keyword, suggestion, language FROM suggestions WHERE email = '$email' ORDER BY id LIMIT $setDataRow OFFSET $offset");
                                    while($rows = mysqli_fetch_assoc($arr))
                                    {
                                        $suggestions[] = $rows;
                                    }

                                    $data['data']['suggestions'] = $suggestions;
                                    $data['data']['totalData'] = $totalData['totalData'];
                                    $data['data']['currentPage'] = $currentPage;
                                }
                            }
                        }
                        else
                        {
                            $data['info'] = info($state = 206);
                        }
                    }
                    else
                    {
                        $data['info'] = info($state = 204);
                    }
                }
                else
                {
                    $data['info'] = info($state = 203);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'pagination')
            {
                $email = $_POST['email'];
                $token = $_POST['token'];
                $setDataRow = $_POST['setDataRow'];
                $currentPage = $_POST['currentPage'];
                $offset = ($currentPage - 1) * $setDataRow;
                $wd = $_POST['wd'];

                $sql = mysqli_query($db, "SELECT * FROM users WHERE email = '$email'");
                if(mysqli_num_rows($sql) === 1)
                {
                    $row = mysqli_fetch_assoc($sql);
                    if($token === $row['token'])
                    {
                        $suggestions = [];
                        if($wd !== '')
                        {
                            $arr = mysqli_query($db, "SELECT id, wd, keyword, suggestion, language FROM suggestions WHERE email = '$email' AND wd LIKE '$wd%' OR keyword LIKE '$wd%' OR suggestion LIKE '$wd%' ORDER BY id LIMIT $setDataRow OFFSET $offset");
                            while($rows = mysqli_fetch_assoc($arr))
                            {
                                $suggestions[] = $rows;
                            }

                            $data['data']['suggestions'] = $suggestions;
                        }
                        else
                        {
                            $arr = mysqli_query($db, "SELECT id, wd, keyword, suggestion, language FROM suggestions WHERE email = '$email' ORDER BY id LIMIT $setDataRow OFFSET $offset");
                            while($rows = mysqli_fetch_assoc($arr))
                            {
                                $suggestions[] = $rows;
                            }

                            $data['data']['suggestions'] = $suggestions;
                        }
                    }
                    else
                    {
                        $data['info'] = info($state = 204);
                    }
                }
                else
                {
                    $data['info'] = info($state = 203);
                }
                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
            else if($action === 'search')
            {
                $wd = $_POST['wd'];

                $suggestions = [];
                $arr = mysqli_query($db, "SELECT suggestion FROM suggestions WHERE wd LIKE '$wd%' OR keyword LIKE '$wd%' OR suggestion LIKE '$wd%' ORDER BY id LIMIT 10");
                while($rows = mysqli_fetch_assoc($arr))
                {
                    $suggestions[] = $rows['suggestion'];
                }

                $data['data']['suggestions'] = $suggestions;

                echo json_encode($data);
                mysqli_close($db);
                return false;
            }
        }
?>