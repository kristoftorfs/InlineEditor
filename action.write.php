<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;
if (!$this->CheckPermission('InlineEditor')) exit;

$ret = true;
if ($_POST['site'] != $this->GetSiteId()) {
    $ret = false;
} else {
    $table = $this->GetTable();
    $this->db->Execute("REPLACE INTO `$table` VALUES (?, ?, ?, ?, ?)", array($_POST['site'], $_POST['page'], $_POST['name'], serialize($_POST), $_POST['value']));
    $ret = ($this->db->ErrorNo() == 0);
}

header('Content-Type: application/json');
echo json_encode($ret);