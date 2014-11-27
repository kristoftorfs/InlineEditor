<?php

/** @var InlineEditor $this */
if (!isset($gCms)) exit;

if (empty($params)) return;

// We always need these two
$page = ContentOperations::get_instance()->getContentObject()->Alias();
$site = NetDesign::GetInstance()->GetSiteId();

// Add our HTML attributes
if (array_key_exists('map', $params) && array_key_exists('property', $params) && array_key_exists('id', $params)) {
    // We are editing a Map
    $map = $params['map'];
    $mid = $params['id'];
    $prp = $params['property'];
    /** @var MapBase $object */
    $object = new $map($mid);
    // Check if the property can be edited
    $parser = $object->getParser();
    $type = $parser->getConfig('type', $prp);
    // Default attributes
    $attrs = array('site' => $site, 'page' => $page, 'map' => $map, 'mid' => $mid, 'prp' => $prp);
    // Generate a name
    $attrs['name'] = sprintf('%s(%d).%s', $map, $mid, $prp);
    switch($type) {
        case 'string':
            $attrs['type'] = 'string';
            break;
        case 'text':
            $html = MapBase::castBool($parser->getConfig('text-html', $prp, false));
            if (!$html) return;
            $attrs['type'] = 'text';
            break;
        case 'thumbnail':
            /** @var Thumbnail $thumb */
            $thumb = $object->$prp;
            $attrs['type'] = 'thumbnail';
            $attrs['width'] = $thumb->GetConfigWidth();
            $attrs['height'] = $thumb->GetConfigHeight();
            break;
    }
    // Output the attributes
    foreach($attrs as $key => $value) {
        printf(' data-inline-editor-%s="%s"', $key, htmlentities($value));
    }
} elseif (array_key_exists('redirect', $params)) {
    // Check for proper module and parse module action
    $redirect = explode('.', $params['redirect'], 2);
    if (count($redirect) < 2) $redirect[1] = 'defaultadmin';    // Default action is defaultadmin
    if (!is_subclass_of($redirect[0], 'NetDesign')) return;
    // Clone $params
    $p = array();
    $del = array('module', 'action', 'redirect');
    foreach($params as $key => $value) {
        $skip = array('module', 'action', 'redirect');
        if (in_array($key, $skip)) continue;
        $p[$key] = $value;
    }
    // Output site
    printf(' data-inline-editor-%s="%s"', 'site', htmlentities($this->GetSiteId()));
    // Output type
    printf(' data-inline-editor-%s="%s"', 'type', 'redirect');
    // Output URL
    /** @var NetDesign $module */
    $module = $redirect[0]::getInstance();
    printf(' data-inline-editor-%s="%s"', 'redirect', $module->create_url('__actionId__', $redirect[1], '', $p));
} else {
    // Simple editing
    $params['page'] = $page;
    if (array_key_exists('sitewide', $params) && (bool)$params['sitewide'] === true) {
        unset($params['sitewide']);
        $params['page'] = '*';
    }
    $params['site'] = $site;
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
    // Special code for a link
    if ($params['type'] == 'link') {
        if (!empty($value)) {
            $value = unserialize($value);
            $value['text'] = htmlentities($value['text']);
        } else {
            $href = null;
            if (array_key_exists('default', $params)) {
                if (!is_numeric($params['default'])) {
                    // An alias is given, get the id
                    /** @var ContentOperations $cops */
                    $cops = cmsms()->GetContentOperations();
                    $params['default'] = $cops->GetPageIDFromAlias($params['default']);
                }
                $href = $params['default'];
            }
            $value = array('href' => $href, 'text' => '');
        }
    }
    $params['link-value'] = $value['href'];
    $this->smarty->assign('value', $value);
    // Output HTML element attributes
    foreach($params as $key => $value) {
        $skip = array('module', 'action');
        if (in_array($key, $skip)) continue;
        printf(' data-inline-editor-%s="%s"', $key, htmlentities($value));
    }
}
