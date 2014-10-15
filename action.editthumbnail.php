<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;
if (!$this->CheckPermission('InlineEditor')) exit;

if (array_key_exists('map', $params) && array_key_exists('prp', $params) && array_key_exists('mid', $params)) {
    // Map thumbnail
    $map = $params['map'];
    $mid = $params['mid'];
    $prp = $params['prp'];
    /** @var MapBase $object */
    $object = new $map($mid);
    /** @var Thumbnail $thumb */
    $thumb = $object->$prp;
    $uid = $thumb->GetUid();
    $owner = Mapper::GetInstance();
} else {
    // Simple editing
    $owner = $this;
    $uid = sprintf('%s/%s/%s', $this->GetSiteId(), $params['page'], $params['name']);
}
$editor = ThumbnailEditor::GetInstance();
$editor->EditorInit($this, $owner, 'editthumbnail', $id, $uid, $params['width'], $params['height'], $params);
$ret = $editor->EditorProcess();
if (in_array($ret, array(ThumbnailEditor::OPERATION_CANCELLED, ThumbnailEditor::OPERATION_SUBMITTED))) {
    $_SESSION['InlineEditor'] = array('url' => $params['iframeurl'], 'name' => $params['name']);
    $this->Redirect($id, 'defaultadmin', '');
} else {
    $editor->EditorDisplay();
}