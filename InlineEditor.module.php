<?php

require_once(__DIR__ . '/../NetDesign/NetDesign.module.php');

class InlineEditor extends NetDesign {
    public function __construct() {
        $this->RegisterClassDirectory(cms_join_path($this->GetModulePath(), 'libs'), '');
        parent::__construct();
    }

    function GetVersion() {
        return '1.0.0';
    }

    function GetAdminSection() {
        return 'content';
    }

    public function GetAdminMenuItems() {
        $ret = CmsAdminMenuItem::from_module($this);
        $ret->title = $this->Lang('friendlyname');
        return array($ret);
    }

}