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

// Set the value
$table = $this->GetTable();
$ret = $this->db->GetArray("SELECT * FROM `$table` WHERE `site_id` = ? AND `page_alias` = ? AND `name` = ?", array($params['site'], $params['page'], $params['name']));
if (empty($ret) || empty($ret[0]['value'])) {
    $value = null;
} else {
    $ret = $ret[0];
    $config = unserialize($ret['config']);
    $value = $ret['value'];
    if ($config['type'] == 'string') $value = htmlentities($value);
    if (empty($value)) $value = null;
}
$this->smarty->assign('value', $value);

