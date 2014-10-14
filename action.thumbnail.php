<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;
$page = ContentOperations::get_instance()->getContentObject()->Alias();
$uid = sprintf('%s/%s', $page, $params['name']);
$thumb = ThumbnailEditor::GetInstance()->Load($this, $uid);
$default = array_key_exists('default', $params) ? $params['default'] : '';
if (array_key_exists('original', $params)) $params['original'] = (bool)$params['original'];
if ($params['original']) {
    $ret = $thumb->GetOriginalUrl();
} else {
    $ret = $thumb->GetThumbnailUrl();
}
if (empty($ret)) echo $default;
else echo $ret;