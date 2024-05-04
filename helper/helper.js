const crypto = require('crypto');
const { encode } = require('gpt-3-encoder');
const fs = require('fs');
// const axios = require('axios');
const OpenAI = require('openai');
const { generateEmbeddings } = require('../vectordb/supabase.js');

function generateApiKey() {
    return
}


async function createChunk(documentation, isSQL) {
    console.log("🚀 ~ createChunk ~ documentation:", documentation)

    return documentation.map(ele => {

        return {
            content: ele,
            content_length: ele.length,
            content_token: encode(ele.trim()).length,
            // trainingDataType
        }
    })

}

const prepareArrayOfStringForFinetune = async (schema) => {

    const sqlSchema2 = `



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
CREATE SCHEMA person;


ALTER SCHEMA person OWNER TO postgres;

COMMENT ON SCHEMA person IS 'Contains objects related to names and addresses of customers, vendors, and employees';


SET default_tablespace = '';

SET default_table_access_method = heap;
CREATE TABLE person.address (
    addressid integer NOT NULL,
    addressline1 character varying(60) NOT NULL,
    addressline2 character varying(60),
    city character varying(30) NOT NULL,
    stateprovinceid integer NOT NULL,
    postalcode character varying(15) NOT NULL,
    spatiallocation character varying(44),
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.address OWNER TO postgres;

COMMENT ON TABLE person.address IS 'Street address information for customers, employees, and vendors.';


COMMENT ON COLUMN person.address.addressid IS 'Primary key for Address records.';


COMMENT ON COLUMN person.address.addressline1 IS 'First street address line.';


COMMENT ON COLUMN person.address.addressline2 IS 'Second street address line.';


COMMENT ON COLUMN person.address.city IS 'Name of the city.';


COMMENT ON COLUMN person.address.stateprovinceid IS 'Unique identification number for the state or province. Foreign key to StateProvince table.';


COMMENT ON COLUMN person.address.postalcode IS 'Postal code for the street address.';


COMMENT ON COLUMN person.address.spatiallocation IS 'Latitude and longitude of this address.';

CREATE TABLE person.businessentityaddress (
    businessentityid integer NOT NULL,
    addressid integer NOT NULL,
    addresstypeid integer NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.businessentityaddress OWNER TO postgres;

COMMENT ON TABLE person.businessentityaddress IS 'Cross-reference table mapping customers, vendors, and employees to their addresses.';


COMMENT ON COLUMN person.businessentityaddress.businessentityid IS 'Primary key. Foreign key to BusinessEntity.BusinessEntityID.';


COMMENT ON COLUMN person.businessentityaddress.addressid IS 'Primary key. Foreign key to Address.AddressID.';


COMMENT ON COLUMN person.businessentityaddress.addresstypeid IS 'Primary key. Foreign key to AddressType.AddressTypeID.';

CREATE TABLE person.countryregion (
    countryregioncode character varying(3) NOT NULL,
    name public."Name" NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.countryregion OWNER TO postgres;

COMMENT ON TABLE person.countryregion IS 'Lookup table containing the ISO standard codes for countries and regions.';


COMMENT ON COLUMN person.countryregion.countryregioncode IS 'ISO standard code for countries and regions.';


COMMENT ON COLUMN person.countryregion.name IS 'Country or region name.';

CREATE TABLE person.emailaddress (
    businessentityid integer NOT NULL,
    emailaddressid integer NOT NULL,
    emailaddress character varying(50),
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.emailaddress OWNER TO postgres;

COMMENT ON TABLE person.emailaddress IS 'Where to send a person email.';


COMMENT ON COLUMN person.emailaddress.businessentityid IS 'Primary key. Person associated with this email address.  Foreign key to Person.BusinessEntityID';


COMMENT ON COLUMN person.emailaddress.emailaddressid IS 'Primary key. ID of this email address.';


COMMENT ON COLUMN person.emailaddress.emailaddress IS 'E-mail address for the person.';

CREATE TABLE person.person (
    businessentityid integer NOT NULL,
    persontype character(2) NOT NULL,
    namestyle public."NameStyle" DEFAULT false NOT NULL,
    title character varying(8),
    firstname public."Name" NOT NULL,
    middlename public."Name",
    lastname public."Name" NOT NULL,
    suffix character varying(10),
    emailpromotion integer DEFAULT 0 NOT NULL,
    additionalcontactinfo xml,
    demographics xml,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "CK_Person_EmailPromotion" CHECK (((emailpromotion >= 0) AND (emailpromotion <= 2))),
    CONSTRAINT "CK_Person_PersonType" CHECK (((persontype IS NULL) OR (upper((persontype)::text) = ANY (ARRAY['SC'::text, 'VC'::text, 'IN'::text, 'EM'::text, 'SP'::text, 'GC'::text]))))
);


ALTER TABLE person.person OWNER TO postgres;

COMMENT ON TABLE person.person IS 'Human beings involved with AdventureWorks: employees, customer contacts, and vendor contacts.';


COMMENT ON COLUMN person.person.businessentityid IS 'Primary key for Person records.';


COMMENT ON COLUMN person.person.persontype IS 'Primary type of person: SC = Store Contact, IN = Individual (retail) customer, SP = Sales person, EM = Employee (non-sales), VC = Vendor contact, GC = General contact';


COMMENT ON COLUMN person.person.namestyle IS '0 = The data in FirstName and LastName are stored in western style (first name, last name) order.  1 = Eastern style (last name, first name) order.';


COMMENT ON COLUMN person.person.title IS 'A courtesy title. For example, Mr. or Ms.';


COMMENT ON COLUMN person.person.firstname IS 'First name of the person.';


COMMENT ON COLUMN person.person.middlename IS 'Middle name or middle initial of the person.';


COMMENT ON COLUMN person.person.lastname IS 'Last name of the person.';


COMMENT ON COLUMN person.person.suffix IS 'Surname suffix. For example, Sr. or Jr.';


COMMENT ON COLUMN person.person.emailpromotion IS '0 = Contact does not wish to receive e-mail promotions, 1 = Contact does wish to receive e-mail promotions from AdventureWorks, 2 = Contact does wish to receive e-mail promotions from AdventureWorks and selected partners.';


COMMENT ON COLUMN person.person.additionalcontactinfo IS 'Additional contact information about the person stored in xml format.';


COMMENT ON COLUMN person.person.demographics IS 'Personal information such as hobbies, and income collected from online shoppers. Used for sales analysis.';

CREATE TABLE person.personphone (
    businessentityid integer NOT NULL,
    phonenumber public."Phone" NOT NULL,
    phonenumbertypeid integer NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.personphone OWNER TO postgres;

COMMENT ON TABLE person.personphone IS 'Telephone number and type of a person.';


COMMENT ON COLUMN person.personphone.businessentityid IS 'Business entity identification number. Foreign key to Person.BusinessEntityID.';


COMMENT ON COLUMN person.personphone.phonenumber IS 'Telephone number identification number.';


COMMENT ON COLUMN person.personphone.phonenumbertypeid IS 'Kind of phone number. Foreign key to PhoneNumberType.PhoneNumberTypeID.';

CREATE TABLE person.phonenumbertype (
    phonenumbertypeid integer NOT NULL,
    name public."Name" NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.phonenumbertype OWNER TO postgres;

COMMENT ON TABLE person.phonenumbertype IS 'Type of phone number of a person.';


COMMENT ON COLUMN person.phonenumbertype.phonenumbertypeid IS 'Primary key for telephone number type records.';


COMMENT ON COLUMN person.phonenumbertype.name IS 'Name of the telephone number type';

CREATE TABLE person.stateprovince (
    stateprovinceid integer NOT NULL,
    stateprovincecode character(3) NOT NULL,
    countryregioncode character varying(3) NOT NULL,
    isonlystateprovinceflag public."Flag" DEFAULT true NOT NULL,
    name public."Name" NOT NULL,
    territoryid integer NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.stateprovince OWNER TO postgres;

COMMENT ON TABLE person.stateprovince IS 'State and province lookup table.';


COMMENT ON COLUMN person.stateprovince.stateprovinceid IS 'Primary key for StateProvince records.';


COMMENT ON COLUMN person.stateprovince.stateprovincecode IS 'ISO standard state or province code.';


COMMENT ON COLUMN person.stateprovince.countryregioncode IS 'ISO standard country or region code. Foreign key to CountryRegion.CountryRegionCode.';


COMMENT ON COLUMN person.stateprovince.isonlystateprovinceflag IS '0 = StateProvinceCode exists. 1 = StateProvinceCode unavailable, using CountryRegionCode.';


COMMENT ON COLUMN person.stateprovince.name IS 'State or province description.';


COMMENT ON COLUMN person.stateprovince.territoryid IS 'ID of the territory in which the state or province is located. Foreign key to SalesTerritory.SalesTerritoryID.';

CREATE TABLE person.addresstype (
    addresstypeid integer NOT NULL,
    name public."Name" NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.addresstype OWNER TO postgres;

COMMENT ON TABLE person.addresstype IS 'Types of addresses stored in the Address table.';


COMMENT ON COLUMN person.addresstype.addresstypeid IS 'Primary key for AddressType records.';


COMMENT ON COLUMN person.addresstype.name IS 'Address type description. For example, Billing, Home, or Shipping.';

CREATE TABLE person.businessentity (
    businessentityid integer NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.businessentity OWNER TO postgres;

COMMENT ON TABLE person.businessentity IS 'Source of the ID that connects vendors, customers, and employees with address and contact information.';


COMMENT ON COLUMN person.businessentity.businessentityid IS 'Primary key for all customers, vendors, and employees.';

CREATE TABLE person.businessentitycontact (
    businessentityid integer NOT NULL,
    personid integer NOT NULL,
    contacttypeid integer NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.businessentitycontact OWNER TO postgres;

COMMENT ON TABLE person.businessentitycontact IS 'Cross-reference table mapping stores, vendors, and employees to people';


COMMENT ON COLUMN person.businessentitycontact.businessentityid IS 'Primary key. Foreign key to BusinessEntity.BusinessEntityID.';


COMMENT ON COLUMN person.businessentitycontact.personid IS 'Primary key. Foreign key to Person.BusinessEntityID.';


COMMENT ON COLUMN person.businessentitycontact.contacttypeid IS 'Primary key.  Foreign key to ContactType.ContactTypeID.';

CREATE TABLE person.contacttype (
    contacttypeid integer NOT NULL,
    name public."Name" NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.contacttype OWNER TO postgres;

COMMENT ON TABLE person.contacttype IS 'Lookup table containing the types of business entity contacts.';


COMMENT ON COLUMN person.contacttype.contacttypeid IS 'Primary key for ContactType records.';


COMMENT ON COLUMN person.contacttype.name IS 'Contact type description.';

CREATE TABLE person.password (
    businessentityid integer NOT NULL,
    passwordhash character varying(128) NOT NULL,
    passwordsalt character varying(10) NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.password OWNER TO postgres;

COMMENT ON TABLE person.password IS 'One way hashed authentication information';


COMMENT ON COLUMN person.password.passwordhash IS 'Password for the e-mail account.';


COMMENT ON COLUMN person.password.passwordsalt IS 'Random value concatenated with the password string before the password is hashed.';

CREATE SEQUENCE person.address_addressid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.address_addressid_seq OWNER TO postgres;

ALTER SEQUENCE person.address_addressid_seq OWNED BY person.address.addressid;

CREATE SEQUENCE person.addresstype_addresstypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.addresstype_addresstypeid_seq OWNER TO postgres;

ALTER SEQUENCE person.addresstype_addresstypeid_seq OWNED BY person.addresstype.addresstypeid;

CREATE SEQUENCE person.businessentity_businessentityid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.businessentity_businessentityid_seq OWNER TO postgres;

ALTER SEQUENCE person.businessentity_businessentityid_seq OWNED BY person.businessentity.businessentityid;

CREATE SEQUENCE person.contacttype_contacttypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.contacttype_contacttypeid_seq OWNER TO postgres;

ALTER SEQUENCE person.contacttype_contacttypeid_seq OWNED BY person.contacttype.contacttypeid;

CREATE SEQUENCE person.emailaddress_emailaddressid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.emailaddress_emailaddressid_seq OWNER TO postgres;

ALTER SEQUENCE person.emailaddress_emailaddressid_seq OWNED BY person.emailaddress.emailaddressid;

CREATE SEQUENCE person.phonenumbertype_phonenumbertypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.phonenumbertype_phonenumbertypeid_seq OWNER TO postgres;

ALTER SEQUENCE person.phonenumbertype_phonenumbertypeid_seq OWNED BY person.phonenumbertype.phonenumbertypeid;

CREATE SEQUENCE person.stateprovince_stateprovinceid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.stateprovince_stateprovinceid_seq OWNER TO postgres;

ALTER SEQUENCE person.stateprovince_stateprovinceid_seq OWNED BY person.stateprovince.stateprovinceid;

CREATE VIEW person.vadditionalcontactinfo AS
 SELECT p.businessentityid,
    p.firstname,
    p.middlename,
    p.lastname,
    (xpath('(act:telephoneNumber)[1]/act:number/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS telephonenumber,
    btrim((((xpath('(act:telephoneNumber)[1]/act:SpecialInstructions/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1])::character varying)::text) AS telephonespecialinstructions,
    (xpath('(act:homePostalAddress)[1]/act:Street/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS street,
    (xpath('(act:homePostalAddress)[1]/act:City/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS city,
    (xpath('(act:homePostalAddress)[1]/act:StateProvince/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS stateprovince,
    (xpath('(act:homePostalAddress)[1]/act:PostalCode/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS postalcode,
    (xpath('(act:homePostalAddress)[1]/act:CountryRegion/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS countryregion,
    (xpath('(act:homePostalAddress)[1]/act:SpecialInstructions/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS homeaddressspecialinstructions,
    (xpath('(act:eMail)[1]/act:eMailAddress/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS emailaddress,
    btrim((((xpath('(act:eMail)[1]/act:SpecialInstructions/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1])::character varying)::text) AS emailspecialinstructions,
    (xpath('((act:eMail)[1]/act:SpecialInstructions/act:telephoneNumber)[1]/act:number/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS emailtelephonenumber,
    p.rowguid,
    p.modifieddate
   FROM (person.person p
     LEFT JOIN ( SELECT person.businessentityid,
            unnest(xpath('/ci:AdditionalContactInfo'::text, person.additionalcontactinfo, '{{ci,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactInfo}}'::text[])) AS node
           FROM person.person
          WHERE (person.additionalcontactinfo IS NOT NULL)) additional ON ((p.businessentityid = additional.businessentityid)));


ALTER VIEW person.vadditionalcontactinfo OWNER TO postgres;
CREATE MATERIALIZED VIEW person.vstateprovincecountryregion AS
 SELECT sp.stateprovinceid,
    sp.stateprovincecode,
    sp.isonlystateprovinceflag,
    sp.name AS stateprovincename,
    sp.territoryid,
    cr.countryregioncode,
    cr.name AS countryregionname
   FROM (person.stateprovince sp
     JOIN person.countryregion cr ON (((sp.countryregioncode)::text = (cr.countryregioncode)::text)))
  WITH NO DATA;


ALTER MATERIALIZED VIEW person.vstateprovincecountryregion OWNER TO postgres;
ALTER TABLE ONLY person.address ALTER COLUMN addressid SET DEFAULT nextval('person.address_addressid_seq'::regclass);

ALTER TABLE ONLY person.addresstype ALTER COLUMN addresstypeid SET DEFAULT nextval('person.addresstype_addresstypeid_seq'::regclass);

ALTER TABLE ONLY person.businessentity ALTER COLUMN businessentityid SET DEFAULT nextval('person.businessentity_businessentityid_seq'::regclass);

ALTER TABLE ONLY person.contacttype ALTER COLUMN contacttypeid SET DEFAULT nextval('person.contacttype_contacttypeid_seq'::regclass);

ALTER TABLE ONLY person.emailaddress ALTER COLUMN emailaddressid SET DEFAULT nextval('person.emailaddress_emailaddressid_seq'::regclass);

ALTER TABLE ONLY person.phonenumbertype ALTER COLUMN phonenumbertypeid SET DEFAULT nextval('person.phonenumbertype_phonenumbertypeid_seq'::regclass);

ALTER TABLE ONLY person.stateprovince ALTER COLUMN stateprovinceid SET DEFAULT nextval('person.stateprovince_stateprovinceid_seq'::regclass);

ALTER TABLE ONLY person.addresstype
    ADD CONSTRAINT "PK_AddressType_AddressTypeID" PRIMARY KEY (addresstypeid);

ALTER TABLE person.addresstype CLUSTER ON "PK_AddressType_AddressTypeID";

ALTER TABLE ONLY person.address
    ADD CONSTRAINT "PK_Address_AddressID" PRIMARY KEY (addressid);

ALTER TABLE person.address CLUSTER ON "PK_Address_AddressID";

ALTER TABLE ONLY person.businessentityaddress
    ADD CONSTRAINT "PK_BusinessEntityAddress_BusinessEntityID_AddressID_AddressType" PRIMARY KEY (businessentityid, addressid, addresstypeid);

ALTER TABLE person.businessentityaddress CLUSTER ON "PK_BusinessEntityAddress_BusinessEntityID_AddressID_AddressType";

ALTER TABLE ONLY person.businessentitycontact
    ADD CONSTRAINT "PK_BusinessEntityContact_BusinessEntityID_PersonID_ContactTypeI" PRIMARY KEY (businessentityid, personid, contacttypeid);

ALTER TABLE person.businessentitycontact CLUSTER ON "PK_BusinessEntityContact_BusinessEntityID_PersonID_ContactTypeI";

ALTER TABLE ONLY person.businessentity
    ADD CONSTRAINT "PK_BusinessEntity_BusinessEntityID" PRIMARY KEY (businessentityid);

ALTER TABLE person.businessentity CLUSTER ON "PK_BusinessEntity_BusinessEntityID";

ALTER TABLE ONLY person.contacttype
    ADD CONSTRAINT "PK_ContactType_ContactTypeID" PRIMARY KEY (contacttypeid);

ALTER TABLE person.contacttype CLUSTER ON "PK_ContactType_ContactTypeID";

ALTER TABLE ONLY person.countryregion
    ADD CONSTRAINT "PK_CountryRegion_CountryRegionCode" PRIMARY KEY (countryregioncode);

ALTER TABLE person.countryregion CLUSTER ON "PK_CountryRegion_CountryRegionCode";

ALTER TABLE ONLY person.emailaddress
    ADD CONSTRAINT "PK_EmailAddress_BusinessEntityID_EmailAddressID" PRIMARY KEY (businessentityid, emailaddressid);

ALTER TABLE person.emailaddress CLUSTER ON "PK_EmailAddress_BusinessEntityID_EmailAddressID";

ALTER TABLE ONLY person.password
    ADD CONSTRAINT "PK_Password_BusinessEntityID" PRIMARY KEY (businessentityid);

ALTER TABLE person.password CLUSTER ON "PK_Password_BusinessEntityID";

ALTER TABLE ONLY person.personphone
    ADD CONSTRAINT "PK_PersonPhone_BusinessEntityID_PhoneNumber_PhoneNumberTypeID" PRIMARY KEY (businessentityid, phonenumber, phonenumbertypeid);

ALTER TABLE person.personphone CLUSTER ON "PK_PersonPhone_BusinessEntityID_PhoneNumber_PhoneNumberTypeID";

ALTER TABLE ONLY person.person
    ADD CONSTRAINT "PK_Person_BusinessEntityID" PRIMARY KEY (businessentityid);

ALTER TABLE person.person CLUSTER ON "PK_Person_BusinessEntityID";

ALTER TABLE ONLY person.phonenumbertype
    ADD CONSTRAINT "PK_PhoneNumberType_PhoneNumberTypeID" PRIMARY KEY (phonenumbertypeid);

ALTER TABLE person.phonenumbertype CLUSTER ON "PK_PhoneNumberType_PhoneNumberTypeID";

ALTER TABLE ONLY person.stateprovince
    ADD CONSTRAINT "PK_StateProvince_StateProvinceID" PRIMARY KEY (stateprovinceid);

ALTER TABLE person.stateprovince CLUSTER ON "PK_StateProvince_StateProvinceID";

CREATE UNIQUE INDEX ix_vstateprovincecountryregion ON person.vstateprovincecountryregion USING btree (stateprovinceid, countryregioncode);

ALTER TABLE person.vstateprovincecountryregion CLUSTER ON ix_vstateprovincecountryregion;

ALTER TABLE ONLY person.address
    ADD CONSTRAINT "FK_Address_StateProvince_StateProvinceID" FOREIGN KEY (stateprovinceid) REFERENCES person.stateprovince(stateprovinceid);

ALTER TABLE ONLY person.businessentityaddress
    ADD CONSTRAINT "FK_BusinessEntityAddress_AddressType_AddressTypeID" FOREIGN KEY (addresstypeid) REFERENCES person.addresstype(addresstypeid);

ALTER TABLE ONLY person.businessentityaddress
    ADD CONSTRAINT "FK_BusinessEntityAddress_Address_AddressID" FOREIGN KEY (addressid) REFERENCES person.address(addressid);

ALTER TABLE ONLY person.businessentityaddress
    ADD CONSTRAINT "FK_BusinessEntityAddress_BusinessEntity_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.businessentity(businessentityid);

ALTER TABLE ONLY person.businessentitycontact
    ADD CONSTRAINT "FK_BusinessEntityContact_BusinessEntity_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.businessentity(businessentityid);

ALTER TABLE ONLY person.businessentitycontact
    ADD CONSTRAINT "FK_BusinessEntityContact_ContactType_ContactTypeID" FOREIGN KEY (contacttypeid) REFERENCES person.contacttype(contacttypeid);

ALTER TABLE ONLY person.businessentitycontact
    ADD CONSTRAINT "FK_BusinessEntityContact_Person_PersonID" FOREIGN KEY (personid) REFERENCES person.person(businessentityid);

ALTER TABLE ONLY person.emailaddress
    ADD CONSTRAINT "FK_EmailAddress_Person_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.person(businessentityid);

ALTER TABLE ONLY person.password
    ADD CONSTRAINT "FK_Password_Person_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.person(businessentityid);

ALTER TABLE ONLY person.personphone
    ADD CONSTRAINT "FK_PersonPhone_Person_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.person(businessentityid);

ALTER TABLE ONLY person.personphone
    ADD CONSTRAINT "FK_PersonPhone_PhoneNumberType_PhoneNumberTypeID" FOREIGN KEY (phonenumbertypeid) REFERENCES person.phonenumbertype(phonenumbertypeid);

ALTER TABLE ONLY person.person
    ADD CONSTRAINT "FK_Person_BusinessEntity_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.businessentity(businessentityid);

ALTER TABLE ONLY person.stateprovince
    ADD CONSTRAINT "FK_StateProvince_CountryRegion_CountryRegionCode" FOREIGN KEY (countryregioncode) REFERENCES person.countryregion(countryregioncode);

ALTER TABLE ONLY person.stateprovince
    ADD CONSTRAINT "FK_StateProvince_SalesTerritory_TerritoryID" FOREIGN KEY (territoryid) REFERENCES sales.salesterritory(territoryid);




`
    const sqlSchema = `


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
CREATE SCHEMA person;


ALTER SCHEMA person OWNER TO postgres;

COMMENT ON SCHEMA person IS 'Contains objects related to names and addresses of customers, vendors, and employees';


SET default_tablespace = '';

SET default_table_access_method = heap;
CREATE TABLE person.address (
    addressid integer NOT NULL,
    addressline1 character varying(60) NOT NULL,
    addressline2 character varying(60),
    city character varying(30) NOT NULL,
    stateprovinceid integer NOT NULL,
    postalcode character varying(15) NOT NULL,
    spatiallocation character varying(44),
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.address OWNER TO postgres;

COMMENT ON TABLE person.address IS 'Street address information for customers, employees, and vendors.';


COMMENT ON COLUMN person.address.addressid IS 'Primary key for Address records.';


COMMENT ON COLUMN person.address.addressline1 IS 'First street address line.';


COMMENT ON COLUMN person.address.addressline2 IS 'Second street address line.';


COMMENT ON COLUMN person.address.city IS 'Name of the city.';


COMMENT ON COLUMN person.address.stateprovinceid IS 'Unique identification number for the state or province. Foreign key to StateProvince table.';


COMMENT ON COLUMN person.address.postalcode IS 'Postal code for the street address.';


COMMENT ON COLUMN person.address.spatiallocation IS 'Latitude and longitude of this address.';

CREATE TABLE person.businessentityaddress (
    businessentityid integer NOT NULL,
    addressid integer NOT NULL,
    addresstypeid integer NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.businessentityaddress OWNER TO postgres;

COMMENT ON TABLE person.businessentityaddress IS 'Cross-reference table mapping customers, vendors, and employees to their addresses.';


COMMENT ON COLUMN person.businessentityaddress.businessentityid IS 'Primary key. Foreign key to BusinessEntity.BusinessEntityID.';


COMMENT ON COLUMN person.businessentityaddress.addressid IS 'Primary key. Foreign key to Address.AddressID.';


COMMENT ON COLUMN person.businessentityaddress.addresstypeid IS 'Primary key. Foreign key to AddressType.AddressTypeID.';

CREATE TABLE person.countryregion (
    countryregioncode character varying(3) NOT NULL,
    name public."Name" NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.countryregion OWNER TO postgres;

COMMENT ON TABLE person.countryregion IS 'Lookup table containing the ISO standard codes for countries and regions.';


COMMENT ON COLUMN person.countryregion.countryregioncode IS 'ISO standard code for countries and regions.';


COMMENT ON COLUMN person.countryregion.name IS 'Country or region name.';

CREATE TABLE person.emailaddress (
    businessentityid integer NOT NULL,
    emailaddressid integer NOT NULL,
    emailaddress character varying(50),
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.emailaddress OWNER TO postgres;

COMMENT ON TABLE person.emailaddress IS 'Where to send a person email.';


COMMENT ON COLUMN person.emailaddress.businessentityid IS 'Primary key. Person associated with this email address.  Foreign key to Person.BusinessEntityID';


COMMENT ON COLUMN person.emailaddress.emailaddressid IS 'Primary key. ID of this email address.';


COMMENT ON COLUMN person.emailaddress.emailaddress IS 'E-mail address for the person.';

CREATE TABLE person.person (
    businessentityid integer NOT NULL,
    persontype character(2) NOT NULL,
    namestyle public."NameStyle" DEFAULT false NOT NULL,
    title character varying(8),
    firstname public."Name" NOT NULL,
    middlename public."Name",
    lastname public."Name" NOT NULL,
    suffix character varying(10),
    emailpromotion integer DEFAULT 0 NOT NULL,
    additionalcontactinfo xml,
    demographics xml,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "CK_Person_EmailPromotion" CHECK (((emailpromotion >= 0) AND (emailpromotion <= 2))),
    CONSTRAINT "CK_Person_PersonType" CHECK (((persontype IS NULL) OR (upper((persontype)::text) = ANY (ARRAY['SC'::text, 'VC'::text, 'IN'::text, 'EM'::text, 'SP'::text, 'GC'::text]))))
);


ALTER TABLE person.person OWNER TO postgres;

COMMENT ON TABLE person.person IS 'Human beings involved with AdventureWorks: employees, customer contacts, and vendor contacts.';


COMMENT ON COLUMN person.person.businessentityid IS 'Primary key for Person records.';


COMMENT ON COLUMN person.person.persontype IS 'Primary type of person: SC = Store Contact, IN = Individual (retail) customer, SP = Sales person, EM = Employee (non-sales), VC = Vendor contact, GC = General contact';


COMMENT ON COLUMN person.person.namestyle IS '0 = The data in FirstName and LastName are stored in western style (first name, last name) order.  1 = Eastern style (last name, first name) order.';


COMMENT ON COLUMN person.person.title IS 'A courtesy title. For example, Mr. or Ms.';


COMMENT ON COLUMN person.person.firstname IS 'First name of the person.';


COMMENT ON COLUMN person.person.middlename IS 'Middle name or middle initial of the person.';


COMMENT ON COLUMN person.person.lastname IS 'Last name of the person.';


COMMENT ON COLUMN person.person.suffix IS 'Surname suffix. For example, Sr. or Jr.';


COMMENT ON COLUMN person.person.emailpromotion IS '0 = Contact does not wish to receive e-mail promotions, 1 = Contact does wish to receive e-mail promotions from AdventureWorks, 2 = Contact does wish to receive e-mail promotions from AdventureWorks and selected partners.';


COMMENT ON COLUMN person.person.additionalcontactinfo IS 'Additional contact information about the person stored in xml format.';


COMMENT ON COLUMN person.person.demographics IS 'Personal information such as hobbies, and income collected from online shoppers. Used for sales analysis.';

CREATE TABLE person.personphone (
    businessentityid integer NOT NULL,
    phonenumber public."Phone" NOT NULL,
    phonenumbertypeid integer NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.personphone OWNER TO postgres;

COMMENT ON TABLE person.personphone IS 'Telephone number and type of a person.';


COMMENT ON COLUMN person.personphone.businessentityid IS 'Business entity identification number. Foreign key to Person.BusinessEntityID.';


COMMENT ON COLUMN person.personphone.phonenumber IS 'Telephone number identification number.';


COMMENT ON COLUMN person.personphone.phonenumbertypeid IS 'Kind of phone number. Foreign key to PhoneNumberType.PhoneNumberTypeID.';

CREATE TABLE person.phonenumbertype (
    phonenumbertypeid integer NOT NULL,
    name public."Name" NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.phonenumbertype OWNER TO postgres;

COMMENT ON TABLE person.phonenumbertype IS 'Type of phone number of a person.';


COMMENT ON COLUMN person.phonenumbertype.phonenumbertypeid IS 'Primary key for telephone number type records.';


COMMENT ON COLUMN person.phonenumbertype.name IS 'Name of the telephone number type';

CREATE TABLE person.stateprovince (
    stateprovinceid integer NOT NULL,
    stateprovincecode character(3) NOT NULL,
    countryregioncode character varying(3) NOT NULL,
    isonlystateprovinceflag public."Flag" DEFAULT true NOT NULL,
    name public."Name" NOT NULL,
    territoryid integer NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.stateprovince OWNER TO postgres;

COMMENT ON TABLE person.stateprovince IS 'State and province lookup table.';


COMMENT ON COLUMN person.stateprovince.stateprovinceid IS 'Primary key for StateProvince records.';


COMMENT ON COLUMN person.stateprovince.stateprovincecode IS 'ISO standard state or province code.';


COMMENT ON COLUMN person.stateprovince.countryregioncode IS 'ISO standard country or region code. Foreign key to CountryRegion.CountryRegionCode.';


COMMENT ON COLUMN person.stateprovince.isonlystateprovinceflag IS '0 = StateProvinceCode exists. 1 = StateProvinceCode unavailable, using CountryRegionCode.';


COMMENT ON COLUMN person.stateprovince.name IS 'State or province description.';


COMMENT ON COLUMN person.stateprovince.territoryid IS 'ID of the territory in which the state or province is located. Foreign key to SalesTerritory.SalesTerritoryID.';

CREATE TABLE person.addresstype (
    addresstypeid integer NOT NULL,
    name public."Name" NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.addresstype OWNER TO postgres;

COMMENT ON TABLE person.addresstype IS 'Types of addresses stored in the Address table.';


COMMENT ON COLUMN person.addresstype.addresstypeid IS 'Primary key for AddressType records.';


COMMENT ON COLUMN person.addresstype.name IS 'Address type description. For example, Billing, Home, or Shipping.';

CREATE TABLE person.businessentity (
    businessentityid integer NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.businessentity OWNER TO postgres;

COMMENT ON TABLE person.businessentity IS 'Source of the ID that connects vendors, customers, and employees with address and contact information.';


COMMENT ON COLUMN person.businessentity.businessentityid IS 'Primary key for all customers, vendors, and employees.';

CREATE TABLE person.businessentitycontact (
    businessentityid integer NOT NULL,
    personid integer NOT NULL,
    contacttypeid integer NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.businessentitycontact OWNER TO postgres;

COMMENT ON TABLE person.businessentitycontact IS 'Cross-reference table mapping stores, vendors, and employees to people';


COMMENT ON COLUMN person.businessentitycontact.businessentityid IS 'Primary key. Foreign key to BusinessEntity.BusinessEntityID.';


COMMENT ON COLUMN person.businessentitycontact.personid IS 'Primary key. Foreign key to Person.BusinessEntityID.';


COMMENT ON COLUMN person.businessentitycontact.contacttypeid IS 'Primary key.  Foreign key to ContactType.ContactTypeID.';

CREATE TABLE person.contacttype (
    contacttypeid integer NOT NULL,
    name public."Name" NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.contacttype OWNER TO postgres;

COMMENT ON TABLE person.contacttype IS 'Lookup table containing the types of business entity contacts.';


COMMENT ON COLUMN person.contacttype.contacttypeid IS 'Primary key for ContactType records.';


COMMENT ON COLUMN person.contacttype.name IS 'Contact type description.';

CREATE TABLE person.password (
    businessentityid integer NOT NULL,
    passwordhash character varying(128) NOT NULL,
    passwordsalt character varying(10) NOT NULL,
    rowguid uuid DEFAULT extensions.uuid_generate_v1() NOT NULL,
    modifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE person.password OWNER TO postgres;

COMMENT ON TABLE person.password IS 'One way hashed authentication information';


COMMENT ON COLUMN person.password.passwordhash IS 'Password for the e-mail account.';


COMMENT ON COLUMN person.password.passwordsalt IS 'Random value concatenated with the password string before the password is hashed.';

CREATE SEQUENCE person.address_addressid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.address_addressid_seq OWNER TO postgres;

ALTER SEQUENCE person.address_addressid_seq OWNED BY person.address.addressid;

CREATE SEQUENCE person.addresstype_addresstypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.addresstype_addresstypeid_seq OWNER TO postgres;

ALTER SEQUENCE person.addresstype_addresstypeid_seq OWNED BY person.addresstype.addresstypeid;

CREATE SEQUENCE person.businessentity_businessentityid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.businessentity_businessentityid_seq OWNER TO postgres;

ALTER SEQUENCE person.businessentity_businessentityid_seq OWNED BY person.businessentity.businessentityid;

CREATE SEQUENCE person.contacttype_contacttypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.contacttype_contacttypeid_seq OWNER TO postgres;

ALTER SEQUENCE person.contacttype_contacttypeid_seq OWNED BY person.contacttype.contacttypeid;

CREATE SEQUENCE person.emailaddress_emailaddressid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.emailaddress_emailaddressid_seq OWNER TO postgres;

ALTER SEQUENCE person.emailaddress_emailaddressid_seq OWNED BY person.emailaddress.emailaddressid;

CREATE SEQUENCE person.phonenumbertype_phonenumbertypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.phonenumbertype_phonenumbertypeid_seq OWNER TO postgres;

ALTER SEQUENCE person.phonenumbertype_phonenumbertypeid_seq OWNED BY person.phonenumbertype.phonenumbertypeid;

CREATE SEQUENCE person.stateprovince_stateprovinceid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE person.stateprovince_stateprovinceid_seq OWNER TO postgres;

ALTER SEQUENCE person.stateprovince_stateprovinceid_seq OWNED BY person.stateprovince.stateprovinceid;

CREATE VIEW person.vadditionalcontactinfo AS
 SELECT p.businessentityid,
    p.firstname,
    p.middlename,
    p.lastname,
    (xpath('(act:telephoneNumber)[1]/act:number/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS telephonenumber,
    btrim((((xpath('(act:telephoneNumber)[1]/act:SpecialInstructions/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1])::character varying)::text) AS telephonespecialinstructions,
    (xpath('(act:homePostalAddress)[1]/act:Street/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS street,
    (xpath('(act:homePostalAddress)[1]/act:City/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS city,
    (xpath('(act:homePostalAddress)[1]/act:StateProvince/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS stateprovince,
    (xpath('(act:homePostalAddress)[1]/act:PostalCode/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS postalcode,
    (xpath('(act:homePostalAddress)[1]/act:CountryRegion/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS countryregion,
    (xpath('(act:homePostalAddress)[1]/act:SpecialInstructions/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS homeaddressspecialinstructions,
    (xpath('(act:eMail)[1]/act:eMailAddress/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS emailaddress,
    btrim((((xpath('(act:eMail)[1]/act:SpecialInstructions/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1])::character varying)::text) AS emailspecialinstructions,
    (xpath('((act:eMail)[1]/act:SpecialInstructions/act:telephoneNumber)[1]/act:number/text()'::text, additional.node, '{{act,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactTypes}}'::text[]))[1] AS emailtelephonenumber,
    p.rowguid,
    p.modifieddate
   FROM (person.person p
     LEFT JOIN ( SELECT person.businessentityid,
            unnest(xpath('/ci:AdditionalContactInfo'::text, person.additionalcontactinfo, '{{ci,http://schemas.microsoft.com/sqlserver/2004/07/adventure-works/ContactInfo}}'::text[])) AS node
           FROM person.person
          WHERE (person.additionalcontactinfo IS NOT NULL)) additional ON ((p.businessentityid = additional.businessentityid)));


ALTER VIEW person.vadditionalcontactinfo OWNER TO postgres;
CREATE MATERIALIZED VIEW person.vstateprovincecountryregion AS
 SELECT sp.stateprovinceid,
    sp.stateprovincecode,
    sp.isonlystateprovinceflag,
    sp.name AS stateprovincename,
    sp.territoryid,
    cr.countryregioncode,
    cr.name AS countryregionname
   FROM (person.stateprovince sp
     JOIN person.countryregion cr ON (((sp.countryregioncode)::text = (cr.countryregioncode)::text)))
  WITH NO DATA;


ALTER MATERIALIZED VIEW person.vstateprovincecountryregion OWNER TO postgres;
ALTER TABLE ONLY person.address ALTER COLUMN addressid SET DEFAULT nextval('person.address_addressid_seq'::regclass);

ALTER TABLE ONLY person.addresstype ALTER COLUMN addresstypeid SET DEFAULT nextval('person.addresstype_addresstypeid_seq'::regclass);

ALTER TABLE ONLY person.businessentity ALTER COLUMN businessentityid SET DEFAULT nextval('person.businessentity_businessentityid_seq'::regclass);

ALTER TABLE ONLY person.contacttype ALTER COLUMN contacttypeid SET DEFAULT nextval('person.contacttype_contacttypeid_seq'::regclass);

ALTER TABLE ONLY person.emailaddress ALTER COLUMN emailaddressid SET DEFAULT nextval('person.emailaddress_emailaddressid_seq'::regclass);

ALTER TABLE ONLY person.phonenumbertype ALTER COLUMN phonenumbertypeid SET DEFAULT nextval('person.phonenumbertype_phonenumbertypeid_seq'::regclass);

ALTER TABLE ONLY person.stateprovince ALTER COLUMN stateprovinceid SET DEFAULT nextval('person.stateprovince_stateprovinceid_seq'::regclass);

ALTER TABLE ONLY person.addresstype
    ADD CONSTRAINT "PK_AddressType_AddressTypeID" PRIMARY KEY (addresstypeid);

ALTER TABLE person.addresstype CLUSTER ON "PK_AddressType_AddressTypeID";

ALTER TABLE ONLY person.address
    ADD CONSTRAINT "PK_Address_AddressID" PRIMARY KEY (addressid);

ALTER TABLE person.address CLUSTER ON "PK_Address_AddressID";

ALTER TABLE ONLY person.businessentityaddress
    ADD CONSTRAINT "PK_BusinessEntityAddress_BusinessEntityID_AddressID_AddressType" PRIMARY KEY (businessentityid, addressid, addresstypeid);

ALTER TABLE person.businessentityaddress CLUSTER ON "PK_BusinessEntityAddress_BusinessEntityID_AddressID_AddressType";

ALTER TABLE ONLY person.businessentitycontact
    ADD CONSTRAINT "PK_BusinessEntityContact_BusinessEntityID_PersonID_ContactTypeI" PRIMARY KEY (businessentityid, personid, contacttypeid);

ALTER TABLE person.businessentitycontact CLUSTER ON "PK_BusinessEntityContact_BusinessEntityID_PersonID_ContactTypeI";

ALTER TABLE ONLY person.businessentity
    ADD CONSTRAINT "PK_BusinessEntity_BusinessEntityID" PRIMARY KEY (businessentityid);

ALTER TABLE person.businessentity CLUSTER ON "PK_BusinessEntity_BusinessEntityID";

ALTER TABLE ONLY person.contacttype
    ADD CONSTRAINT "PK_ContactType_ContactTypeID" PRIMARY KEY (contacttypeid);

ALTER TABLE person.contacttype CLUSTER ON "PK_ContactType_ContactTypeID";

ALTER TABLE ONLY person.countryregion
    ADD CONSTRAINT "PK_CountryRegion_CountryRegionCode" PRIMARY KEY (countryregioncode);

ALTER TABLE person.countryregion CLUSTER ON "PK_CountryRegion_CountryRegionCode";

ALTER TABLE ONLY person.emailaddress
    ADD CONSTRAINT "PK_EmailAddress_BusinessEntityID_EmailAddressID" PRIMARY KEY (businessentityid, emailaddressid);

ALTER TABLE person.emailaddress CLUSTER ON "PK_EmailAddress_BusinessEntityID_EmailAddressID";

ALTER TABLE ONLY person.password
    ADD CONSTRAINT "PK_Password_BusinessEntityID" PRIMARY KEY (businessentityid);

ALTER TABLE person.password CLUSTER ON "PK_Password_BusinessEntityID";

ALTER TABLE ONLY person.personphone
    ADD CONSTRAINT "PK_PersonPhone_BusinessEntityID_PhoneNumber_PhoneNumberTypeID" PRIMARY KEY (businessentityid, phonenumber, phonenumbertypeid);

ALTER TABLE person.personphone CLUSTER ON "PK_PersonPhone_BusinessEntityID_PhoneNumber_PhoneNumberTypeID";

ALTER TABLE ONLY person.person
    ADD CONSTRAINT "PK_Person_BusinessEntityID" PRIMARY KEY (businessentityid);

ALTER TABLE person.person CLUSTER ON "PK_Person_BusinessEntityID";

ALTER TABLE ONLY person.phonenumbertype
    ADD CONSTRAINT "PK_PhoneNumberType_PhoneNumberTypeID" PRIMARY KEY (phonenumbertypeid);

ALTER TABLE person.phonenumbertype CLUSTER ON "PK_PhoneNumberType_PhoneNumberTypeID";

ALTER TABLE ONLY person.stateprovince
    ADD CONSTRAINT "PK_StateProvince_StateProvinceID" PRIMARY KEY (stateprovinceid);

ALTER TABLE person.stateprovince CLUSTER ON "PK_StateProvince_StateProvinceID";

CREATE UNIQUE INDEX ix_vstateprovincecountryregion ON person.vstateprovincecountryregion USING btree (stateprovinceid, countryregioncode);

ALTER TABLE person.vstateprovincecountryregion CLUSTER ON ix_vstateprovincecountryregion;

ALTER TABLE ONLY person.address
    ADD CONSTRAINT "FK_Address_StateProvince_StateProvinceID" FOREIGN KEY (stateprovinceid) REFERENCES person.stateprovince(stateprovinceid);

ALTER TABLE ONLY person.businessentityaddress
    ADD CONSTRAINT "FK_BusinessEntityAddress_AddressType_AddressTypeID" FOREIGN KEY (addresstypeid) REFERENCES person.addresstype(addresstypeid);

ALTER TABLE ONLY person.businessentityaddress
    ADD CONSTRAINT "FK_BusinessEntityAddress_Address_AddressID" FOREIGN KEY (addressid) REFERENCES person.address(addressid);

ALTER TABLE ONLY person.businessentityaddress
    ADD CONSTRAINT "FK_BusinessEntityAddress_BusinessEntity_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.businessentity(businessentityid);

ALTER TABLE ONLY person.businessentitycontact
    ADD CONSTRAINT "FK_BusinessEntityContact_BusinessEntity_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.businessentity(businessentityid);

ALTER TABLE ONLY person.businessentitycontact
    ADD CONSTRAINT "FK_BusinessEntityContact_ContactType_ContactTypeID" FOREIGN KEY (contacttypeid) REFERENCES person.contacttype(contacttypeid);

ALTER TABLE ONLY person.businessentitycontact
    ADD CONSTRAINT "FK_BusinessEntityContact_Person_PersonID" FOREIGN KEY (personid) REFERENCES person.person(businessentityid);

ALTER TABLE ONLY person.emailaddress
    ADD CONSTRAINT "FK_EmailAddress_Person_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.person(businessentityid);

ALTER TABLE ONLY person.password
    ADD CONSTRAINT "FK_Password_Person_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.person(businessentityid);

ALTER TABLE ONLY person.personphone
    ADD CONSTRAINT "FK_PersonPhone_Person_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.person(businessentityid);

ALTER TABLE ONLY person.personphone
    ADD CONSTRAINT "FK_PersonPhone_PhoneNumberType_PhoneNumberTypeID" FOREIGN KEY (phonenumbertypeid) REFERENCES person.phonenumbertype(phonenumbertypeid);

ALTER TABLE ONLY person.person
    ADD CONSTRAINT "FK_Person_BusinessEntity_BusinessEntityID" FOREIGN KEY (businessentityid) REFERENCES person.businessentity(businessentityid);

ALTER TABLE ONLY person.stateprovince
    ADD CONSTRAINT "FK_StateProvince_CountryRegion_CountryRegionCode" FOREIGN KEY (countryregioncode) REFERENCES person.countryregion(countryregioncode);

ALTER TABLE ONLY person.stateprovince
    ADD CONSTRAINT "FK_StateProvince_SalesTerritory_TerritoryID" FOREIGN KEY (territoryid) REFERENCES sales.salesterritory(territoryid);


`
    // Read the SQL file
    // const sqlFile = fs.readFileSync('/path/to/your/sql/file.sql', 'utf-8');

    let sysPrompt = `
            You are helpfull assistant, user provide sql file content and you create array of string for finetune in below JSON format

            {
                SCHEMA: ["tableName: table1, columns: [column1, column2, column3]", "tableName: table2, columns: [column1, column2, column3]"],
                RELATIONS: ["table1 has a foreign key to table2", "table2 has a foreign key to table3"],
                SQL: [{
                    "question": "Create sample question,",
                    "DDL": "SQL for the question, if schema is postgresql, include the schema name in query"
                },{
                    "question": "Create sample question, this should include joining table query,",
                    "DDL": "SQL for the question"
                }, {
                    "question": "Create sample question, this shouldinclude joining table query,",
                    "DDL": "SQL for the question"
                }]
            }

            Do not prefix with explainatino, just provide the array of strings in the JSON format above. 
    `
    try {
        const openai = new OpenAI({
            apiKey: "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"
        });

        const requestBody = {
            model: 'gpt-3.5-turbo',
            messages: [{
                "role": "system",
                "content": sysPrompt
            }, {
                "role": "user",
                "content": sqlSchema
            },
            {
                "role": "assistant",
                "content": `
                {
                    "SCHEMA": [
                        "tableName: address, columns: [addressid, addressline1, addressline2, city, stateprovinceid, postalcode, spatiallocation, rowguid, modifieddate]",
                        "tableName: businessentityaddress, columns: [businessentityid, addressid, addresstypeid, rowguid, modifieddate]",
                        "tableName: countryregion, columns: [countryregioncode, name, modifieddate]",
                        "tableName: emailaddress, columns: [businessentityid, emailaddressid, emailaddress, rowguid, modifieddate]",
                        "tableName: person, columns: [businessentityid, persontype, namestyle, title, firstname, middlename, lastname, suffix, emailpromotion, additionalcontactinfo, demographics, rowguid, modifieddate]",
                        "tableName: personphone, columns: [businessentityid, phonenumber, phonenumbertypeid, modifieddate]",
                        "tableName: phonenumbertype, columns: [phonenumbertypeid, name, modifieddate]",
                        "tableName: stateprovince, columns: [stateprovinceid, stateprovincecode, countryregioncode, isonlystateprovinceflag, name, territoryid, rowguid, modifieddate]",
                        "tableName: addresstype, columns: [addresstypeid, name, rowguid, modifieddate]",
                        "tableName: businessentity, columns: [businessentityid, rowguid, modifieddate]",
                        "tableName: businessentitycontact, columns: [businessentityid, personid, contacttypeid, rowguid, modifieddate]",
                        "tableName: contacttype, columns: [contacttypeid, name, modifieddate]",
                        "tableName: password, columns: [businessentityid, passwordhash, passwordsalt, rowguid, modifieddate]"
                    ],
                    "RELATIONS": [
                        "address has a foreign key to stateprovince",
                        "businessentityaddress has a foreign key to address",
                        "businessentityaddress has a foreign key to businessentity",
                        "businessentityaddress has a foreign key to addresstype",
                        "businessentitycontact has a foreign key to businessentity",
                        "businessentitycontact has a foreign key to person",
                        "businessentitycontact has a foreign key to contacttype",
                        "emailaddress has a foreign key to person",
                        "password has a foreign key to person",
                        "person has a foreign key to businessentity",
                        "personphone has a foreign key to person",
                        "personphone has a foreign key to phonenumbertype",
                        "stateprovince has a foreign key to countryregion"
                    ],
                    "SQL": [
                        {
                            "question": "What are the details of all persons from a specific city?",
                            "SQL": "SELECT * FROM person.person p JOIN person.address a ON p.businessentityid = a.addressid WHERE a.city = 'SpecificCity';"
                        },
                        {
                            "question": "How can I find email addresses and phone numbers for all persons in a specific state?",
                            "SQL": "SELECT p.firstname, p.lastname, e.emailaddress, ph.phonenumber FROM person.person p JOIN person.emailaddress e ON p.businessentityid = e.businessentityid JOIN person.personphone ph ON p.businessentityid = ph.businessentityid JOIN person.address a ON p.businessentityid = a.addressid JOIN person.stateprovince sp ON a.stateprovinceid = sp.stateprovinceid WHERE sp.name = 'SpecificState';"
                        },
                        {
                            "question": "List all business entities that have more than one address type associated with them.",
                            "SQL": "SELECT b.businessentityid, COUNT(a.addresstypeid) AS AddressTypeCount FROM person.businessentityaddress b JOIN person.addresstype a ON b.addresstypeid = a.addresstypeid GROUP BY b.businessentityid HAVING COUNT(a.addresstypeid) > 1;"
                        }
                    ]
                }
                
                `
            }, {
                "role": "user",
                "content": schema
            }
            ],
            temperature: 0.2,
            // stream: true
        };

        const response = await openai.chat.completions.create(requestBody);
        let content = response.choices[0]?.message.content;
        // console.log("🚀 ~ prepareArrayOfStringForFinetune ~ content:", content)
        // console.log("🚀 ~Type ~ content:", typeof content)
        let data = JSON.parse(content);
        console.log(data); // Handle the response data here
        // console.log("Strngfy:",JSON.stringify(response.choices[1]?.message.content)); 
        // console.log("parse:",JSON.parse(`${response.choices[1]?.message.content}`).Relations?.length); 
        return data
    } catch (error) {
        console.error("Error:", error);
        // Handle the error here
        throw error;
    }
}

async function processDataset(dataset, modelId, userId, fileId) {
    try {
        // const isSQL = trainingDataType === 'SQL'
        // let docForSQL = []
        // if (isSQL) {
        //     docForSQL = documentation.map((doc) => `${doc.question} ${doc.DDL}`)
        // }

        // Create an array of promises, one for each key in the dataset
        const promises = Object.entries(dataset).map(async ([key, data]) => {
            try {
                const isSQL = (key === 'SQL')
                let docForSQL = []
                if (isSQL) {
                    docForSQL = data.map((doc) => `${doc.question} ${doc.DDL}`)
                }

                let chunks = await createChunk((isSQL ? docForSQL : data), isSQL)
                // const chunks = await createChunk(data, false);
                await generateEmbeddings(chunks, modelId, userId, key, data, fileId);
            } catch (error) {
                throw error;
            }
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
        console.log('All requests completed successfully.');
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

module.exports = {
    createChunk,
    prepareArrayOfStringForFinetune,
    processDataset
};