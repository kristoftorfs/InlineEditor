<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;

$site = NetDesign::GetInstance()->GetSiteId();
$page = ContentOperations::get_instance()->getContentObject()->Alias();
$default = array_key_exists('default', $params) ? $params['default'] : '';
$name = $params['name'];

$table = $this->GetTable();
$ret = $this->db->GetArray("SELECT * FROM `$table` WHERE `site_id` = ? AND `page_alias` = ? AND `name` = ?", array($site, $page, $name));
if (empty($ret) || empty($ret[0]['value'])) {
    echo $default;
    return;
}

$ret = $ret[0];
$config = unserialize($ret['config']);
$value = $ret['value'];

switch($config['type']) {
    case 'string':
        echo htmlentities($value);
        break;
    case 'text':
        echo $value;
        break;
}