<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;
if (!$this->CheckPermission('InlineEditor')) exit;

$uid = sprintf('%s/%s/%s', $this->GetSiteId(), $params['page'], $params['name']);
$editor = ThumbnailEditor::GetInstance();
$editor->EditorInit($this, 'editthumbnail', $id, $uid, $params['width'], $params['height'], $params);
$ret = $editor->EditorProcess();
if (in_array($ret, array(ThumbnailEditor::OPERATION_CANCELLED, ThumbnailEditor::OPERATION_SUBMITTED))) {
    $_SESSION['InlineEditor'] = array('url' => $params['iframeurl'], 'name' => $params['name']);
    $this->Redirect($id, 'defaultadmin', '');
} else {
    $editor->EditorDisplay();
}