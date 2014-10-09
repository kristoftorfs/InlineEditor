<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;
if (!$this->CheckPermission('InlineEditor')) exit;
/** @var CmsAdminThemeBase $theme */
$theme = CmsAdminThemeBase::GetThemeObject();

// Configuration
$this->smarty->assign('editIcon', cms_join_path($this->GetModuleURLPath(), 'assets', 'edit.png'));
$this->smarty->assign('site_id', NetDesign::GetInstance()->GetSiteId());
$this->smarty->assign('assetUrl', cms_join_path($this->GetModuleURLPath(), 'assets'));
$this->smarty->assign('writeUrl', $this->create_url($id, 'write', '', array('suppress' => '1')));
$this->smarty->assign('thumbForm', $this->CreateFormStart($id, 'editthumbnail', '', 'post', '', false, '', array(), 'data-form="editthumbnail"') . $this->CreateFormEnd());
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
    $this->smarty->assign('textarea', $this->CreateTextArea(true, null, '', 'textarea'));
}
echo $this->smarty->fetch($this->GetFileResource('defaultadmin.tpl'));