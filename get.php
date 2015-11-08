<?php
set_time_limit(0);
$ch = curl_init();
$timeout = 10;
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Accept: */*',
    'Accept-Charset: UTF-8,*;q=0.5',
    'Accept-Encoding: gzip,deflate,sdch',
    'Accept-Language: zh-CN,zh;q=0.8',
    'Connection: keep-alive',
    'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
    'Referer: http://document.thinkphp.cn/manual_3_2.html',
    'User-Agent: Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11',
    'X-Requested-With: XMLHttpRequest',
));

$manual_dir = 'manual_3_2';
$mydir = dir('manual_3_2');
while($file = $mydir->read()){
	if(is_dir("$manual_dir/$file") || !strstr($file, '.html')){
		continue;
	}
	
	//http://document.thinkphp.cn/manual_3_2/set_config.html
	$reuqest_url = 'http://document.thinkphp.cn/'.$manual_dir.'/'.$file;
	echo $reuqest_url.'<hr>';
	curl_setopt($ch, CURLOPT_URL, $reuqest_url);
	$file_contents = curl_exec($ch);
	$file_contents = str_replace('\/Uploads', 'Uploads', $file_contents);
	$file_contents = str_replace('/Uploads', 'Uploads', $file_contents);
	file_put_contents($manual_dir.'/'.$file, $file_contents);
}
curl_close($ch);
?>