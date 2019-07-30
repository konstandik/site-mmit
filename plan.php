<?php
    date_default_timezone_set('Asia/Irkutsk');
    $file='data-log.txt';
    $date = date('m/d/Y h:i:s a', time());
    file_put_contents($file, $date . PHP_EOL, FILE_APPEND | LOCK_EX);
    echo("hello");
?>