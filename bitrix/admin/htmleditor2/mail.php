<?php 
  if(empty($_POST['to'])) exit("Введите адрес получателя"); 

  // проверяем правильности заполнения с помощью регулярного выражения 
  $_POST['from'] = htmlspecialchars(stripslashes($_POST['from'])); 
  $_POST['fromm'] = htmlspecialchars(stripslashes($_POST['fromm']));
  $_POST['to'] = htmlspecialchars(stripslashes($_POST['to'])); 
  $_POST['send_charset'] = htmlspecialchars(stripslashes($_POST['send_charset'])); 
  //$_POST['subject'] = htmlspecialchars(stripslashes($_POST['subject'])); 
  //$_POST['body'] = htmlspecialchars(stripslashes($_POST['body'])); 
  $_POST['type_m'] = htmlspecialchars(stripslashes($_POST['type_m'])); 
  $picture = ""; 

  // Если поле выбора вложения не пустое - закачиваем его на сервер 
  if (!empty($_FILES['mail_file']['tmp_name'])) 
  { 
    // Закачиваем файл 
    $path = $_FILES['mail_file']['name']; 
    if (copy($_FILES['mail_file']['tmp_name'], $path)) $picture = $path; 
  }
  
  //$charset = "windows-1251";
  
  $mail_from          = $_POST['from']; 
  $mail_fromm         = $_POST['fromm'];
  $mail_to            = $_POST['to']; 
  $mail_send_charset  = $_POST['send_charset']; 
  $mail_subject       = $_POST['subject']; 
  $mail_body          = $_POST['body']; 
  $mail_type_m        = $_POST['type_m']; 

  $mail_body          = iconv($mail_send_charset, $mail_send_charset, $mail_body);  
  $mail_subject          = iconv($mail_send_charset, $mail_send_charset, $mail_subject);  
  
  $headers .= "From: $mail_from <$mail_fromm>\r\n"; 
  $headers .= "Content-type: text/$mail_type_m; charset=$mail_send_charset\r\n"; 
  $headers .= "MIME-Version: 1.0\r\n"; 
			 
  // Отправляем почтовое сообщение 
  if(empty($picture)) { 
    if (mail($mail_to, $mail_subject, $mail_body, $headers)) print("ok"); else print("error");
		
  } else send_mail($mail_to, $mail_from, $mail_fromm, $mail_send_charset, $mail_subject, $mail_body, $mail_type_m, $picture); 

  // Вспомогательная функция для отправки почтового сообщения с вложением 

function send_mail($to, $from, $fromm, $charset_msg, $thm, $html, $type_m, $path){ 

	$fp = fopen($path,"r"); 
	if (!$fp) 
	{ 
	  print "Файл $path не может быть прочитан"; 
	  exit(); 
	} 
	$file = fread($fp, filesize($path)); 
	fclose($fp); 

    $boundary = "--".md5(uniqid(time())); // генерируем разделитель 
	
    $headers .= "From: $from <$fromm>\r\n"; 
    $headers .= "Content-Type: multipart/mixed; charset=$charset_msg; boundary=\"$boundary\"\r\n"; 	
    $headers .= "MIME-Version: 1.0\r\n"; 

    
    $multipart .= "--$boundary\n"; 
    $multipart .= "Content-Type: text/$type_m; charset=$charset_msg\n"; 
    $multipart .= "Content-Transfer-Encoding: Quot-Printed\n\n"; 
    $multipart .= "$html\n\n"; 
	
    $message_part = "--$boundary\n"; 
    $message_part .= "Content-Type: application/octet-stream\n"; 
    $message_part .= "Content-Transfer-Encoding: base64\n"; 
    $message_part .= "Content-Disposition: attachment; filename = \"".$path."\"\n\n"; 
    $message_part .= chunk_split(base64_encode($file))."\n"; 
    $multipart .= $message_part."--$boundary--\n"; 
	
    unlink($path);
    if(!mail($to, $thm, $multipart, $headers)) 
    { 
      echo "error"; 
      exit(); 
    } else  print("ok"); 
  }

?>
