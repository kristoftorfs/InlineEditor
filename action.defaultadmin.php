<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;

$this->smarty->assign('site_id', NetDesign::GetInstance()->GetSiteId());
$this->smarty->assign('assetUrl', cms_join_path($this->GetModuleURLPath(), 'assets'));
// Create WYSIWYG
if (class_exists('CmsFormUtils')) {
    // TODO: CMSMS 2.x
    /*
    $parms = array(
        'enablewysiwyg' => 1,
        'name' => $id . 'content',
        'text' => $content,
        'rows' => 10,
        'cols' => 80
    );
    $smarty->assign('inputcontent', CmsFormUtils::create_textarea($parms));
    */
} else {
    // CMSMS 1.x
    $this->smarty->assign('textarea', $this->CreateTextArea(true, null, '', 'textarea', 'editor'));
}
echo $this->smarty->fetch($this->GetFileResource('defaultadmin.tpl'));