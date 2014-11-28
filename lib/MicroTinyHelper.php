<?php

class MicroTinyHelper {
    /**
     * Generate a tinymce initialization file.
     *
     * @return string
     */
    public static function GenerateConfig() {
        $frontend = false;
        $selector = '#textarea';
        $css_name = null;
        $languageid = self::GetLanguageId();
        $mod = cms_utils::get_module('MicroTiny');
        $config = cms_utils::get_config();
        $smarty = cmsms()->GetSmarty();
        $smarty->assign('MicroTiny',$mod);
        $smarty->clear_assign('mt_profile');
        $smarty->clear_assign('mt_selector');
        $smarty->assign('mt_actionid','m1_');
        $smarty->assign('isfrontend',$frontend);
        $smarty->assign('languageid',$languageid);
        if( $selector ) $smarty->assign('mt_selector',$selector);

        try {
            $profile = null;
            if( $frontend ) {
                $profile = microtiny_profile::load(MicroTiny::PROFILE_FRONTEND);
            }
            else {
                $profile = microtiny_profile::load(MicroTiny::PROFILE_ADMIN);
            }

            $smarty->assign('mt_profile',$profile);
            $stylesheet = (int)$profile['dfltstylesheet'];
            if( $stylesheet < 1 ) $stylesheet = null;
            if( $profile['allowcssoverride'] && $css_name ) $stylesheet = $css_name;
            if( $stylesheet ) $smarty->assign('mt_cssname',$stylesheet);
        }
        catch( Exception $e ) {
            // oops, we gots a problem.
            die($e->Getmessage());
        }

        $result = $mod->ProcessTemplate('tinymce_config.js');
        return $result;
    }

    /**
     * Convert users current language to something tinymce can prolly understand (hopefully).
     *
     * @return string
     */
    public static function GetLanguageId() {
        $mylang = CmsNlsOperations::get_current_language();
        if ($mylang=="") return "en"; //Lang setting "No default selected"
        $shortlang = substr($mylang,0,2);

        $mod = cms_utils::get_module('MicroTiny');
        $dir = $mod->GetModulePath().'/lib/js/tinymce/langs';
        $langs = array();
        {
            $files = glob($dir.'/*.js');
            if( is_array($files) && count($files) ) {
                foreach( $files as $one ) {
                    $one = basename($one);
                    $one = substr($one,0,-3);
                    $langs[] = $one;
                }
            }
        }

        if( in_array($mylang,$langs) ) return $mylang;
        if( in_array($shortlang,$langs) ) return $shortlang;
        return 'en';
    }
}