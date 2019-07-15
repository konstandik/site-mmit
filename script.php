<?php
$fp = fopen('www/hostingmmit.ru/data-log.txt', 'a+');//открыть файл а+ добавляет данные к имеющимся
date_default_timezone_set('Asia/Irkutsk');
$time_msk = date("d-m-Y h:i:s"); //получаем текущее время
fwrite($fp, $time_msk."\r\n"); //записываем инфу в конец файла и добавляем отступ
fclose($fp);//закрыть файл
?> 