<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;
if (!$this->CheckPermission('InlineEditor')) exit;
/** @var CmsAdminThemeBase $theme */
$theme = CmsAdminThemeBase::GetThemeObject();
$this->AssignLang();

if (array_key_exists('InlineEditor', $_SESSION)) {
    $this->smarty->assign('gotoSrc', $_SESSION['InlineEditor']['url']);
    $this->smarty->assign('gotoName', $_SESSION['InlineEditor']['name']);
    unset($_SESSION['InlineEditor']);
}

// Configuration
$this->smarty->assign('editIcon', cms_join_path($this->GetModuleURLPath(), 'assets', 'edit.png'));
$this->smarty->assign('site_id', NetDesign::GetInstance()->GetSiteId());
$this->smarty->assign('assetUrl', cms_join_path($this->GetModuleURLPath(), 'assets'));
$this->smarty->assign('writeUrl', $this->create_url($id, 'write', '', array('suppress' => '1')));
$this->smarty->assign('thumbForm', $this->CreateFormStart($id, 'editthumbnail', '', 'post', '', false, '', array(), 'data-form="editthumbnail"') . $this->CreateFormEnd());
if (NetDesign::GetCMSVersion() == 1) {
    // CMSMS 1.x
    $this->smarty->assign('textarea', $this->CreateTextArea(true, null, '', 'textarea'));
} else {
    $this->smarty->assign('dummy', CmsFormUtils::create_textarea(array('name' => 'textarea', 'enablewysiwyg' => true)));
}
/** @var ContentOperations $cops */
$cops = cmsms()->GetContentOperations();
$this->smarty->assign('linkhref', $cops->CreateHierarchyDropdown('', '', 'linkhref'));
$this->smarty->assign('cmsversion', NetDesign::GetCMSVersion());
echo $this->smarty->fetch($this->GetFileResource('defaultadmin.tpl'));