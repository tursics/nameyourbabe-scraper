/*jslint browser: true*/
/*global require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	parserVec: [],

	//-------------------------------------------------------------------

	init: function () {
		'use strict';

		if (this.parserVec.length === 0) {
//			this.parserVec.push(require('./metadata-template'));
			this.parserVec.push(require('./metadata-OGDAustria1-1'));
//			this.parserVec.push(require('./metadata-OGDAustria2-1'));
			this.parserVec.push(require('./metadata-OGDAustria3'));
			this.parserVec.push(require('./metadata-govdata'));
			this.parserVec.push(require('./metadata-Arnsberg'));
		}
	},

	//-------------------------------------------------------------------

	parse: function (contents, json) {
		'use strict';

		var i, parser, ret, schema_name;

		this.init();

		for (i = 0; i < this.parserVec.length; ++i) {
			parser = this.parserVec[i];
			if (parser.accept(contents, json)) {
				return parser.parse(contents, json);
			}
		}

		ret = require('./metadata-result').copy();
		ret.error = true;

		if ((typeof json === 'undefined') || (json === null) || (0 === json.length)) {
			ret.errorMsg = '-';
		} else {
			schema_name = 'unknown';
			if ((typeof json.result !== 'undefined') && (typeof json.result.extras !== 'undefined') && (json.result.extras !== null)) {
				for (i = 0; i < json.result.extras.length; ++i) {
					if (json.result.extras[i].key === 'schema_name') {
						schema_name = json.result.extras[i].value;
					}
				}
			}

			ret.errorMsg = 'Unknown metadata format (' + schema_name + ') found';
		}

		return ret;
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof

/*
<?php

//------------------------------------------------------------------------------

class HarvestMetadataParserOGDAustria21 extends HarvestMetadataParserOGDAustria11
{
	public function accept( contents, json)
	{
		return json['extras']['schema_name'] == 'OGD Austria Metadata 2.1';
	}

	public function parse( contents, json)
	{
		return parent::parse( contents, json);
	}
} // class HarvestMetadataParserOGDAustria21
$HarvestMetadata->addParser('HarvestMetadataParserOGDAustria21');

//------------------------------------------------------------------------------

class HarvestMetadataParserOGDGermany extends HarvestMetadataParserBase
{
	public function accept( contents, json)
	{
		return json['extras']['sector'] == 'oeffentlich';
	}

	public function parse( contents, json)
	{
		ret = require('./metadata-result').copy();
		ret.modified = strtotime( json['metadata_modified']);
		ret.modDays = intval(( strtotime( 'now') - ret.modified) /60 /60 /24);
		ret.vecURL = Array();
		ret.vecName = Array();

		for( i = 0; i < json['resources'].length; ++i) {
			ret.vecURL[] = json['resources'][i]['url'];
			ret.vecName[] = json['resources'][i]['name'];
		}

		this.parseCopyright( ret, json['license_title'], json['license_url'], '');

		ret.error = false;
		ret.errorMsg = '';

		return ret;
	}
} // class HarvestMetadataParserOGDGermany
$HarvestMetadata->addParser('HarvestMetadataParserOGDGermany');

//------------------------------------------------------------------------------

class HarvestMetadataParserOGDD1 extends HarvestMetadataParserBase
{
	public function accept( contents, json)
	{
		return json['extras']['ogdd_version'] == 'v1.0.0';
	}

	public function parse( contents, json)
	{
		ret = require('./metadata-result').copy();
		ret.modified = strtotime( json['metadata_modified']);
		ret.modDays = intval(( strtotime( 'now') - ret.modified) /60 /60 /24);
		ret.vecURL = Array();
		ret.vecName = Array();

		for( i = 0; i < json['resources'].length; ++i) {
			ret.vecURL[] = json['resources'][i]['url'];
			ret.vecName[] = json['resources'][i]['description'];
		}

		this.parseCopyright( ret, json['license_title'], json['license_url'], '');

		ret.error = false;
		ret.errorMsg = '';

		return ret;
	}
} // class HarvestMetadataParserOGDD1
$HarvestMetadata->addParser('HarvestMetadataParserOGDD1');

//------------------------------------------------------------------------------

class HarvestMetadataParserMoers extends HarvestMetadataParserBase
{
	public function accept( contents, json)
	{
		return (0 == json.length) && (false !== strpos( contents, 'moers.de'));
	}

	public function parse( contents, json)
	{
		ret = require('./metadata-result').copy();
		ret.errorMsg = 'Could not parse metadata of Moers';

		$posName = strpos( contents, '<title>') + strlen( '<title>');
		$posModified = strpos( contents, 'Veröffentlicht am');
		$posLicence = strpos( contents, 'Lizenz');
		$posUrl = strpos( contents, '>Daten<');

		if( false === $posModified) {
			ret.errorMsg .= ' (pos modified)';
			return ret;
		}
		if( false === $posLicence) {
			ret.errorMsg .= ' (pos licence)';
			return ret;
		}
		if( false === $posUrl) {
			ret.errorMsg .= ' (pos url)';
			return ret;
		}
		if( false === $posName) {
			ret.errorMsg .= ' (pos name)';
			return ret;
		}

		$strName = substr( contents, $posName, strpos( contents, '</title>', $posName) - $posName);

		$posModified = strpos( contents, '>', strpos( contents, '<td', $posModified)) + 1;
		$strModified = substr( contents, $posModified, strpos( contents, '</td>', $posModified) - $posModified);

		$posLicence = strpos( contents, '>', strpos( contents, '<td', $posLicence)) + 1;
		$strLicence = substr( contents, $posLicence, strpos( contents, '</td>', $posLicence) - $posLicence);

		$posLicUrl = strpos( $strLicence, 'href="') + strlen( 'href="');
		$strLicUrl = substr( $strLicence, $posLicUrl, strpos( $strLicence, '"', $posLicUrl) - $posLicUrl);

		$posLicName = strpos( $strLicence, '>', $posLicUrl) + strlen( '>');
		$strLicName = substr( $strLicence, $posLicName, strpos( $strLicence, '</a', $posLicName) - $posLicName);

		$posUrl = strpos( contents, 'href="', $posUrl) + strlen( 'href="');
		$strUrl = substr( contents, $posUrl, strpos( contents, '"', $posUrl) - $posUrl);
		$strUrl = 'http://www.moers.de' . $strUrl;

		ret.modified = strtotime( $strModified);
		ret.modDays = intval(( strtotime( 'now') - ret.modified) /60 /60 /24);
		ret.vecURL = Array();
		ret.vecName = Array();

		ret.vecURL[] = $strUrl;
		ret.vecName[] = $strName;

		this.parseCopyright( ret, $strLicName, $strLicUrl, '');

		ret.error = false;
		ret.errorMsg = '';

		return ret;
	}
} // class HarvestMetadataParserMoers
$HarvestMetadata->addParser('HarvestMetadataParserMoers');

//------------------------------------------------------------------------------

class HarvestMetadataParserBochum extends HarvestMetadataParserBase
{
	public function accept( contents, json)
	{
		return (0 == json.length) && (false !== strpos( contents, 'Stadt Bochum'));
	}

	public function parse( contents, json)
	{
		ret = require('./metadata-result').copy();
		ret.errorMsg = 'Could not parse metadata of Bochum';

		$posStart = strpos( contents, '<h2 id');
		$posName = strpos( contents, 'Vornamen', $posStart);
		$posModified = strpos( contents, 'zuletzt geändert', $posStart);
		$posLicence = strpos( contents, 'Lizenz', $posStart);
		$posUrl = strpos( contents, '<table', $posStart);
		$posUrlEnd = strpos( contents, '</table>', $posStart);

		if( false === $posModified) {
			ret.errorMsg .= ' (pos modified)';
			return ret;
		}
		if( false === $posLicence) {
			ret.errorMsg .= ' (pos licence)';
			return ret;
		}
		if( false === $posUrl) {
			ret.errorMsg .= ' (pos url)';
			return ret;
		}
		if( false === $posName) {
			ret.errorMsg .= ' (pos name)';
			return ret;
		}

		$strName = substr( contents, $posName, strpos( contents, '</h2>', $posName) - $posName);

		$posModified = strpos( contents, '>', strpos( contents, '<td', $posModified)) + 1;
		$strModified = substr( contents, $posModified, strpos( contents, '<br/>', $posModified) - $posModified);

		$posLicence = strpos( contents, '>', strpos( contents, '<a', $posLicence)) + 1;
		$strLicence = substr( contents, $posLicence, strpos( contents, '</a>', $posLicence) - $posLicence);

		$posLicUrl = strpos( $strLicence, 'href="') + strlen( 'href="');
		$strLicUrl = substr( $strLicence, $posLicUrl, strpos( $strLicence, '"', $posLicUrl) - $posLicUrl);

		$posLicName = strpos( $strLicence, '>', $posLicUrl) + strlen( '>');
		$strLicName = substr( $strLicence, $posLicName, strpos( $strLicence, '</a', $posLicName) - $posLicName);

		ret.vecURL = Array();
		ret.vecName = Array();

		do {
			$posUrl = strpos( contents, '<tr>', $posUrl);
			if( false === $posUrl) {
				break;
			}
			if( $posUrl > $posUrlEnd) {
				break;
			}

			$posUrl = strpos( contents, '<strong>', $posUrl) + strlen( '<strong>');
			$strName = substr( contents, $posUrl, strpos( contents, '</strong>', $posUrl) - $posUrl);
			$strName = strip_tags( $strName);

			$posUrl = strpos( contents, 'href="', $posUrl) + strlen( 'href="');
			$strUrl = substr( contents, $posUrl, strpos( contents, '"', $posUrl) - $posUrl);
			$strUrl = 'http://www.bochum.de' . $strUrl;

			ret.vecURL[] = $strUrl;
			ret.vecName[] = $strName;
		} while( true);

		ret.modified = this.strtotimeLoc( $strModified);
		ret.modDays = intval(( strtotime( 'now') - ret.modified) /60 /60 /24);

		this.parseCopyright( ret, $strLicName, $strLicUrl, '');

		ret.error = false;
		ret.errorMsg = '';

		return ret;
	}
} // class HarvestMetadataParserBochum
$HarvestMetadata->addParser('HarvestMetadataParserBochum');

//------------------------------------------------------------------------------

class HarvestMetadataParserISO19139 extends HarvestMetadataParserBase
{
	public function accept( contents, json)
	{
		return (0 == json.length) && (false !== strpos( contents, 'ISO 19139'));
	}

	public function parse( contents, json)
	{
		ret = require('./metadata-result').copy();
		ret.errorMsg = 'Could not parse metadata of ISO 19139';

		$posName = strpos( contents, '<gmd:citation>');
		$posModified = strpos( contents, '<gmd:dateStamp>');
		$posUrl = strpos( contents, '<gmd:citation>');

		if( false === $posModified) {
			return ret;
		}
		if( false === $posUrl) {
			return ret;
		}
		if( false === $posName) {
			return ret;
		}

//		$posName = strpos( contents, '<gmd:CI_Citation>', $posName);
//		$posName = strpos( contents, '<gmd:title>', $posName);
//		$posName = strpos( contents, '<gco:CharacterString>', $posName) + strlen( '<gco:CharacterString>');
//		$strName = substr( contents, $posName, strpos( contents, '</gco:CharacterString>', $posName) - $posName);

		$posModified = strpos( contents, '>', strpos( contents, '<gco:DateTime', $posModified)) + 1;
		$strModified = substr( contents, $posModified, strpos( contents, '</gco:DateTime>', $posModified) - $posModified);

		$posUrl = strpos( contents, '<gmd:CI_Citation>', $posUrl);
		$posUrl = strpos( contents, '<gmd:identifier>', $posUrl);
		$posUrl = strpos( contents, '<gmd:MD_Identifier>', $posUrl);
		$posUrl = strpos( contents, '<gmd:code>', $posUrl);
		$posUrl = strpos( contents, '<gco:CharacterString>', $posUrl) + strlen( '<gco:CharacterString>');
		$strUrl = substr( contents, $posUrl, strpos( contents, '</gco:CharacterString>', $posUrl) - $posUrl);

		ret.modified = strtotime( $strModified);
		ret.modDays = intval(( strtotime( 'now') - ret.modified) /60 /60 /24);
		ret.vecURL = Array();
		ret.vecName = Array();
//		ret.vecURL[] = $strUrl;
//		ret.vecName[] = $strName;

		if( false !== strpos( $strUrl, 'ulm.de')) {
			ret.errorMsg .= ' (Ulm)';
			$urlContents = file_get_contents( $strUrl);
			this.parseWebsiteUlm( ret, $urlContents);
		} else {
			ret.errorMsg .= ' (' . $strUrl . ')';
			return ret;
		}

//		this.parseCopyright( ret, json['license_title'], json['license_url'], '');

		return ret;
	}

	public function parseWebsiteUlm( & ret, contents)
	{
		$posTable = strpos( contents, '<thead>');

		if( false === $posTable) {
			return;
		}

		$posTable = strpos( contents, '<tbody>', $posTable);
		$strTable = substr( contents, $posTable, strpos( contents, '</tbody>', $posTable) - $posTable);

		$posUrl = 0;

		do {
			$posUrl = strpos( $strTable, 'href="', $posUrl);
			if( false === $posUrl) {
				break;
			}
			$posUrl = $posUrl + strlen( 'href="');
			$strUrl = substr( $strTable, $posUrl, strpos( $strTable, '"', $posUrl) - $posUrl);

			$posName = strpos( $strTable, '>', $posUrl);
			if( false === $posName) {
				break;
			}
			++$posName;
			$strName = substr( $strTable, $posName, strpos( $strTable, '</a>', $posName) - $posName);

			ret.vecURL[] = $strUrl;
			ret.vecName[] = $strName;
		} while( true);

		ret.error = false;
		ret.errorMsg = '';
	}
} // class HarvestMetadataParserISO19139
$HarvestMetadata->addParser('HarvestMetadataParserISO19139');

//------------------------------------------------------------------------------

class HarvestMetadataParserMunich extends HarvestMetadataParserBase
{
	public function accept( contents, json)
	{
		if( is_array( json['extras'])) {
			return array_key_exists( 'Aktualisierungszyklus', json['extras']);
		}
		return false;
	}

	public function parse( contents, json)
	{
		ret = require('./metadata-result').copy();
		ret.modified = strtotime( json['metadata_modified']);
		ret.modDays = intval(( strtotime( 'now') - ret.modified) /60 /60 /24);
		ret.vecURL = Array();
		ret.vecName = Array();

		for( i = 0; i < json['resources'].length; ++i) {
			ret.vecURL[] = json['resources'][i]['url'];
			ret.vecName[] = json['resources'][i]['name'];
		}

		this.parseCopyright( ret, json['license_title'], json['license_url'], '');

		ret.error = false;
		ret.errorMsg = '';

		return ret;
	}
} // class HarvestMetadataParserMunich
$HarvestMetadata->addParser('HarvestMetadataParserMunich');

//------------------------------------------------------------------------------

?>
*/
