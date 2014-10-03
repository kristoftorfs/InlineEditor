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

    function GetAdminMenuItems() {
        if (!$this->CheckPermission('InlineEditor')) return array();
        $ret = CmsAdminMenuItem::from_module($this);
        $ret->title = $this->Lang('friendlyname');
        return array($ret);
    }

    function VisibleToAdminUser() {
        return $this->CheckPermission('InlineEditor');
    }

    function Install() {
        // Create database table
        $db = $this->db;
        $table = $this->GetTable();
        $query = "
        CREATE TABLE IF NOT EXISTS `$table` (
            `site_id` varchar(50) NOT NULL,
            `page_alias` varchar(50) NOT NULL,
            `name` varchar(50) NOT NULL,
            `config` varchar(255) NOT NULL,
            `value` longblob,
            PRIMARY KEY (`site_id`, `page_alias`, `name`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
        ";
        $db->Execute($query);
        // Create permission
        $this->CreatePermission('InlineEditor', 'NetDesign CMS: Inline editing');
        return false;
    }

    function Uninstall() {
        // Remove database table
        $db = $this->db;
        $dict = NewDataDictionary($db);
        $sql = $dict->DropTableSQL($this->GetTable());
        $ret = $dict->ExecuteSQLArray($sql);
        // Remove permission
        $this->RemovePermission('InlineEditor');
        return false;
    }

}