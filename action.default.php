<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;

if (empty($params)) return;
$params['page'] = ContentOperations::get_instance()->getContentObject()->Alias();
$params['site'] = NetDesign::GetInstance()->GetSiteId();
foreach($params as $key => $value) {
    $skip = array('module', 'action');
    if (in_array($key, $skip)) continue;
    printf(' data-inline-editor-%s="%s"', $key, htmlentities($value));
}