<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;
if (!$this->CheckPermission('InlineEditor')) exit;

$ret = true;
if ($_POST['site'] != $this->GetSiteId()) {
    // Shouldn't happen
    $ret = false;
} elseif (array_key_exists('map', $_POST) && array_key_exists('mid', $_POST) && array_key_exists('prp', $_POST)) {
    // Update a Map
    $map = $_POST['map'];
    $mid = $_POST['mid'];
    $prp = $_POST['prp'];
    $val = $_POST['value'];
    /** @var MapBase $object */
    $object = new $map($mid);
    $object->$prp = $val;
    $ret = $object->commit();
} else {
    // Simple editing
    $table = $this->GetTable();
    $value = $_POST['value'];
    unset($_POST['value']);
    $this->db->Execute("REPLACE INTO `$table` VALUES (?, ?, ?, ?, ?)", array($_POST['site'], $_POST['page'], $_POST['name'], serialize($_POST), $value));
    $ret = ($this->db->ErrorNo() == 0);
}

header('Content-Type: application/json');
echo json_encode($ret);