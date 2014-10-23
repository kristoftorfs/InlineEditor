# Inline Editor module

## Module description

This module allows your clients to manage text and images in-place, but in the admin interface.

## Module actions

### Default action

The default action is what is used to mark an element (string or HTML text) as editable. It should be put inside the element tag. This action requires the following
parameters:

- _name_: the name by which you want to identify this element
- _type_: 'string', 'text' or 'thumbnail'
- _width_: the width a thumbnail should have
- _height_: the height a thumbnail should have
- _sitewide_: boolean, if true the element can be used on more than one pages

The default action will complete your HTML tag, but also assign the currently set value to the variable $value. You can work with default values by either using an
if operator or by using the smarty 'default' modifier. Examples of both are given below, however for HTML text it is probably easier and clearer coding by using the
if operator. For string elements, $value will be processed by htmlentities so you don't need to do this in your code.

#### Example code

__String value with a default value coded with the if operator__

```
<h1{InlineEditor name="title" type="string"}>{if $value}{$value}{else}My default title{/if}</h1>
```

__String value with a default value coded with the Smarty modifier__

```
<p class="subtitle"{InlineEditor name="subtitle" type="string"}>{$value|default:"My default subtitle"}</p>
```

__Note__: for HTML text you should set the editing on a wrapping div as seen below:

```
<div class="contents"{InlineEditor name="subtitle" type="text"}>
{if $value}{$value}{else}
<p>Nothing set, so we use a default text for this paragraph.</p>
<p>And another paragraph so our placeholder text isn't too short.</p>
{/if}
</div>
```

__Thumbnail__

```
<a href="{InlineEditor action="thumbnail" original=true name="mythumb" default="$site_url/images/image1.large.jpg"}">
    <img src="{InlineEditor action="thumbnail" name="mythumb" default="$site_url/images/image1.small.jpg"}" alt=""{InlineEditor name="mythumb" type="thumbnail" width=200 height=120}>
</a>
```

<a id="thumbexample"></a>
### Thumbnail action

This is separated from the other two editing options (string and HTML text) as it will output the URL to the image (either the original image or 
the generated thumbnail). Parameters are the following:

- _name_: the name by which the thumbnail is identified
- _original_: set this to TRUE to get the URL to the original image instead of the generated thumbnail (optional parameter)
- _default_: optional parameter to define an URL to be outputted if no image has been uploaded yet  

#### Example code

See the [example above](#thumbexample) under the default action.

### Value action

This action will simply output the value for a certain element. For string elements, the value will be processed by htmlentities so you don't need to do this 
in your code. The parameters for this action are the following:

- _name_: the name by which the element is identified
- _default_: a default value which will be outputted if no value is set for the element

#### Example code

```
<p class="subtitle">{InlineEditor action="value" name="subtitle" default="My default subtitle"}</p>
```

## Editing Map properties

It is possible to edit properties of a Map object, but only if they are one of the three supported types (string, text and thumbnail).

### Example code

```
<div{InlineEditor map="MapProduct" property="text" id=$product->getId()}>{$product->text}</div>
```