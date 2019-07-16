<?php 
@set_time_limit(0);
@ini_set('max_execution_time',0);
@ini_set('set_time_limit',0);
@ini_set('upload_max_filesize','8000000');
error_reporting(E_ALL);
ignore_user_abort(true);

// количество блоков
if (!isset($_REQUEST['c'])) die('Не передан обязательный параметр');
$partsnum = intval($_REQUEST['c']);

echo "###UNPK### Частей: $partsnum.. ";

$filename = dirname(__FILE__)."/part1";
if ($partsnum > 1) { // склеивание блоков в один файл
	$filename = dirname(__FILE__)."/r.zip";
	$fh = fopen("r.zip", "w");
	for($i=1; $i<=$partsnum; $i++) {
		$fh2 = fopen("part$i", "rb");
		$part = fread($fh2, filesize("part$i"));
		fclose($fh2);
		fwrite($fh, $part);
	}
	fclose($fh);
	unset($part);
}

$pclziplibfile = "pclzip.lib.php";
require_once($pclziplibfile);
$archive = new PclZip($filename);

// распаковка
$errorcode = $archive->extract(PCLZIP_OPT_PATH, './');
if ($errorcode == 0) die("Не удалось распаковать архив(Ошибка: $errorcode)");

// вывод содержимого архива
$list = $archive->listContent();
echo "Распаковано файлов: ".sizeof($list)." ";

// удаление файлов
echo "Удаление временных файлов.. ";
_del(__FILE__);
_del($pclziplibfile);
_del(dirname(__FILE__)."/r.zip");
@unlink(dirname(__FILE__)."/uploader.php");
for($i=1; $i<=$partsnum; $i++) if ($filename != "part".$i) _del("part".$i);
echo "Выполнено (SUCCESFULL). ";

function _del($file) {
	if (!@unlink($file)) echo "Не могу удалить $file "; 
	else echo "$file удален ";
}

echo "###UNPKEND###";

?>