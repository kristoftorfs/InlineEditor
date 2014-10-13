<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;
$page = ContentOperations::get_instance()->getContentObject()->Alias();
$uid = sprintf('%s/%s', $page, $params['name']);
$thumb = ThumbnailEditor::GetInstance()->Load($this, $uid);
if (array_key_exists('original', $params)) $params['original'] = (bool)$params['original'];
if ($params['original']) {
    echo $thumb->GetOriginalUrl();
} else {
    echo $thumb->GetThumbnailUrl();
}