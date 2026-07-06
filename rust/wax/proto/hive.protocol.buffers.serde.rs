impl serde::Serialize for AccountCreate {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 8;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.account_create", len)?;
        struct_ser.serialize_field("fee", &self.fee)?;
        struct_ser.serialize_field("creator", &self.creator)?;
        struct_ser.serialize_field("new_account_name", &self.new_account_name)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("active", &self.active)?;
        struct_ser.serialize_field("posting", &self.posting)?;
        struct_ser.serialize_field("memo_key", &self.memo_key)?;
        struct_ser.serialize_field("json_metadata", &self.json_metadata)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for AccountCreate {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "fee",
            "creator",
            "new_account_name",
            "owner",
            "active",
            "posting",
            "memo_key",
            "json_metadata",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Fee,
            Creator,
            NewAccountName,
            Owner,
            Active,
            Posting,
            MemoKey,
            JsonMetadata,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "fee" => Ok(GeneratedField::Fee),
                            "creator" => Ok(GeneratedField::Creator),
                            "new_account_name" => Ok(GeneratedField::NewAccountName),
                            "owner" => Ok(GeneratedField::Owner),
                            "active" => Ok(GeneratedField::Active),
                            "posting" => Ok(GeneratedField::Posting),
                            "memo_key" => Ok(GeneratedField::MemoKey),
                            "json_metadata" => Ok(GeneratedField::JsonMetadata),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = AccountCreate;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.account_create")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<AccountCreate, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut fee__ = None;
                let mut creator__ = None;
                let mut new_account_name__ = None;
                let mut owner__ = None;
                let mut active__ = None;
                let mut posting__ = None;
                let mut memo_key__ = None;
                let mut json_metadata__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Fee => {
                            if fee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fee"));
                            }
                            fee__ = map_.next_value()?;
                        }
                        GeneratedField::Creator => {
                            if creator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("creator"));
                            }
                            creator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::NewAccountName => {
                            if new_account_name__.is_some() {
                                return Err(serde::de::Error::duplicate_field("new_account_name"));
                            }
                            new_account_name__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = map_.next_value()?;
                        }
                        GeneratedField::Active => {
                            if active__.is_some() {
                                return Err(serde::de::Error::duplicate_field("active"));
                            }
                            active__ = map_.next_value()?;
                        }
                        GeneratedField::Posting => {
                            if posting__.is_some() {
                                return Err(serde::de::Error::duplicate_field("posting"));
                            }
                            posting__ = map_.next_value()?;
                        }
                        GeneratedField::MemoKey => {
                            if memo_key__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo_key"));
                            }
                            memo_key__ = Some(map_.next_value()?);
                        }
                        GeneratedField::JsonMetadata => {
                            if json_metadata__.is_some() {
                                return Err(serde::de::Error::duplicate_field("json_metadata"));
                            }
                            json_metadata__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(AccountCreate {
                    fee: fee__.ok_or_else(|| serde::de::Error::missing_field("fee"))?,
                    creator: creator__.ok_or_else(|| serde::de::Error::missing_field("creator"))?,
                    new_account_name: new_account_name__.ok_or_else(|| serde::de::Error::missing_field("new_account_name"))?,
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    active: active__.ok_or_else(|| serde::de::Error::missing_field("active"))?,
                    posting: posting__.ok_or_else(|| serde::de::Error::missing_field("posting"))?,
                    memo_key: memo_key__.ok_or_else(|| serde::de::Error::missing_field("memo_key"))?,
                    json_metadata: json_metadata__.ok_or_else(|| serde::de::Error::missing_field("json_metadata"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.account_create", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for AccountCreateWithDelegation {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 9;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.account_create_with_delegation", len)?;
        struct_ser.serialize_field("fee", &self.fee)?;
        struct_ser.serialize_field("delegation", &self.delegation)?;
        struct_ser.serialize_field("creator", &self.creator)?;
        struct_ser.serialize_field("new_account_name", &self.new_account_name)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("active", &self.active)?;
        struct_ser.serialize_field("posting", &self.posting)?;
        struct_ser.serialize_field("memo_key", &self.memo_key)?;
        struct_ser.serialize_field("json_metadata", &self.json_metadata)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for AccountCreateWithDelegation {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "fee",
            "delegation",
            "creator",
            "new_account_name",
            "owner",
            "active",
            "posting",
            "memo_key",
            "json_metadata",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Fee,
            Delegation,
            Creator,
            NewAccountName,
            Owner,
            Active,
            Posting,
            MemoKey,
            JsonMetadata,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "fee" => Ok(GeneratedField::Fee),
                            "delegation" => Ok(GeneratedField::Delegation),
                            "creator" => Ok(GeneratedField::Creator),
                            "new_account_name" => Ok(GeneratedField::NewAccountName),
                            "owner" => Ok(GeneratedField::Owner),
                            "active" => Ok(GeneratedField::Active),
                            "posting" => Ok(GeneratedField::Posting),
                            "memo_key" => Ok(GeneratedField::MemoKey),
                            "json_metadata" => Ok(GeneratedField::JsonMetadata),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = AccountCreateWithDelegation;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.account_create_with_delegation")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<AccountCreateWithDelegation, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut fee__ = None;
                let mut delegation__ = None;
                let mut creator__ = None;
                let mut new_account_name__ = None;
                let mut owner__ = None;
                let mut active__ = None;
                let mut posting__ = None;
                let mut memo_key__ = None;
                let mut json_metadata__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Fee => {
                            if fee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fee"));
                            }
                            fee__ = map_.next_value()?;
                        }
                        GeneratedField::Delegation => {
                            if delegation__.is_some() {
                                return Err(serde::de::Error::duplicate_field("delegation"));
                            }
                            delegation__ = map_.next_value()?;
                        }
                        GeneratedField::Creator => {
                            if creator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("creator"));
                            }
                            creator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::NewAccountName => {
                            if new_account_name__.is_some() {
                                return Err(serde::de::Error::duplicate_field("new_account_name"));
                            }
                            new_account_name__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = map_.next_value()?;
                        }
                        GeneratedField::Active => {
                            if active__.is_some() {
                                return Err(serde::de::Error::duplicate_field("active"));
                            }
                            active__ = map_.next_value()?;
                        }
                        GeneratedField::Posting => {
                            if posting__.is_some() {
                                return Err(serde::de::Error::duplicate_field("posting"));
                            }
                            posting__ = map_.next_value()?;
                        }
                        GeneratedField::MemoKey => {
                            if memo_key__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo_key"));
                            }
                            memo_key__ = Some(map_.next_value()?);
                        }
                        GeneratedField::JsonMetadata => {
                            if json_metadata__.is_some() {
                                return Err(serde::de::Error::duplicate_field("json_metadata"));
                            }
                            json_metadata__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(AccountCreateWithDelegation {
                    fee: fee__.ok_or_else(|| serde::de::Error::missing_field("fee"))?,
                    delegation: delegation__.ok_or_else(|| serde::de::Error::missing_field("delegation"))?,
                    creator: creator__.ok_or_else(|| serde::de::Error::missing_field("creator"))?,
                    new_account_name: new_account_name__.ok_or_else(|| serde::de::Error::missing_field("new_account_name"))?,
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    active: active__.ok_or_else(|| serde::de::Error::missing_field("active"))?,
                    posting: posting__.ok_or_else(|| serde::de::Error::missing_field("posting"))?,
                    memo_key: memo_key__.ok_or_else(|| serde::de::Error::missing_field("memo_key"))?,
                    json_metadata: json_metadata__.ok_or_else(|| serde::de::Error::missing_field("json_metadata"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.account_create_with_delegation", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for AccountCreated {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.account_created", len)?;
        struct_ser.serialize_field("new_account_name", &self.new_account_name)?;
        struct_ser.serialize_field("creator", &self.creator)?;
        struct_ser.serialize_field("initial_vesting_shares", &self.initial_vesting_shares)?;
        struct_ser.serialize_field("initial_delegation", &self.initial_delegation)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for AccountCreated {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "new_account_name",
            "creator",
            "initial_vesting_shares",
            "initial_delegation",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            NewAccountName,
            Creator,
            InitialVestingShares,
            InitialDelegation,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "new_account_name" => Ok(GeneratedField::NewAccountName),
                            "creator" => Ok(GeneratedField::Creator),
                            "initial_vesting_shares" => Ok(GeneratedField::InitialVestingShares),
                            "initial_delegation" => Ok(GeneratedField::InitialDelegation),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = AccountCreated;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.account_created")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<AccountCreated, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut new_account_name__ = None;
                let mut creator__ = None;
                let mut initial_vesting_shares__ = None;
                let mut initial_delegation__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::NewAccountName => {
                            if new_account_name__.is_some() {
                                return Err(serde::de::Error::duplicate_field("new_account_name"));
                            }
                            new_account_name__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Creator => {
                            if creator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("creator"));
                            }
                            creator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::InitialVestingShares => {
                            if initial_vesting_shares__.is_some() {
                                return Err(serde::de::Error::duplicate_field("initial_vesting_shares"));
                            }
                            initial_vesting_shares__ = map_.next_value()?;
                        }
                        GeneratedField::InitialDelegation => {
                            if initial_delegation__.is_some() {
                                return Err(serde::de::Error::duplicate_field("initial_delegation"));
                            }
                            initial_delegation__ = map_.next_value()?;
                        }
                    }
                }
                Ok(AccountCreated {
                    new_account_name: new_account_name__.ok_or_else(|| serde::de::Error::missing_field("new_account_name"))?,
                    creator: creator__.ok_or_else(|| serde::de::Error::missing_field("creator"))?,
                    initial_vesting_shares: initial_vesting_shares__.ok_or_else(|| serde::de::Error::missing_field("initial_vesting_shares"))?,
                    initial_delegation: initial_delegation__.ok_or_else(|| serde::de::Error::missing_field("initial_delegation"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.account_created", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for AccountUpdate {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 3;
        if self.owner.is_some() {
            len += 1;
        }
        if self.active.is_some() {
            len += 1;
        }
        if self.posting.is_some() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.account_update", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        if let Some(v) = self.owner.as_ref() {
            struct_ser.serialize_field("owner", v)?;
        }
        if let Some(v) = self.active.as_ref() {
            struct_ser.serialize_field("active", v)?;
        }
        if let Some(v) = self.posting.as_ref() {
            struct_ser.serialize_field("posting", v)?;
        }
        struct_ser.serialize_field("memo_key", &self.memo_key)?;
        struct_ser.serialize_field("json_metadata", &self.json_metadata)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for AccountUpdate {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "owner",
            "active",
            "posting",
            "memo_key",
            "json_metadata",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            Owner,
            Active,
            Posting,
            MemoKey,
            JsonMetadata,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "owner" => Ok(GeneratedField::Owner),
                            "active" => Ok(GeneratedField::Active),
                            "posting" => Ok(GeneratedField::Posting),
                            "memo_key" => Ok(GeneratedField::MemoKey),
                            "json_metadata" => Ok(GeneratedField::JsonMetadata),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = AccountUpdate;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.account_update")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<AccountUpdate, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut owner__ = None;
                let mut active__ = None;
                let mut posting__ = None;
                let mut memo_key__ = None;
                let mut json_metadata__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = map_.next_value()?;
                        }
                        GeneratedField::Active => {
                            if active__.is_some() {
                                return Err(serde::de::Error::duplicate_field("active"));
                            }
                            active__ = map_.next_value()?;
                        }
                        GeneratedField::Posting => {
                            if posting__.is_some() {
                                return Err(serde::de::Error::duplicate_field("posting"));
                            }
                            posting__ = map_.next_value()?;
                        }
                        GeneratedField::MemoKey => {
                            if memo_key__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo_key"));
                            }
                            memo_key__ = Some(map_.next_value()?);
                        }
                        GeneratedField::JsonMetadata => {
                            if json_metadata__.is_some() {
                                return Err(serde::de::Error::duplicate_field("json_metadata"));
                            }
                            json_metadata__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(AccountUpdate {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    owner: owner__,
                    active: active__,
                    posting: posting__,
                    memo_key: memo_key__.ok_or_else(|| serde::de::Error::missing_field("memo_key"))?,
                    json_metadata: json_metadata__.ok_or_else(|| serde::de::Error::missing_field("json_metadata"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.account_update", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for AccountUpdate2 {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 3;
        if self.owner.is_some() {
            len += 1;
        }
        if self.active.is_some() {
            len += 1;
        }
        if self.posting.is_some() {
            len += 1;
        }
        if self.memo_key.is_some() {
            len += 1;
        }
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.account_update2", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        if let Some(v) = self.owner.as_ref() {
            struct_ser.serialize_field("owner", v)?;
        }
        if let Some(v) = self.active.as_ref() {
            struct_ser.serialize_field("active", v)?;
        }
        if let Some(v) = self.posting.as_ref() {
            struct_ser.serialize_field("posting", v)?;
        }
        if let Some(v) = self.memo_key.as_ref() {
            struct_ser.serialize_field("memo_key", v)?;
        }
        struct_ser.serialize_field("json_metadata", &self.json_metadata)?;
        struct_ser.serialize_field("posting_json_metadata", &self.posting_json_metadata)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for AccountUpdate2 {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "owner",
            "active",
            "posting",
            "memo_key",
            "json_metadata",
            "posting_json_metadata",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            Owner,
            Active,
            Posting,
            MemoKey,
            JsonMetadata,
            PostingJsonMetadata,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "owner" => Ok(GeneratedField::Owner),
                            "active" => Ok(GeneratedField::Active),
                            "posting" => Ok(GeneratedField::Posting),
                            "memo_key" => Ok(GeneratedField::MemoKey),
                            "json_metadata" => Ok(GeneratedField::JsonMetadata),
                            "posting_json_metadata" => Ok(GeneratedField::PostingJsonMetadata),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = AccountUpdate2;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.account_update2")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<AccountUpdate2, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut owner__ = None;
                let mut active__ = None;
                let mut posting__ = None;
                let mut memo_key__ = None;
                let mut json_metadata__ = None;
                let mut posting_json_metadata__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = map_.next_value()?;
                        }
                        GeneratedField::Active => {
                            if active__.is_some() {
                                return Err(serde::de::Error::duplicate_field("active"));
                            }
                            active__ = map_.next_value()?;
                        }
                        GeneratedField::Posting => {
                            if posting__.is_some() {
                                return Err(serde::de::Error::duplicate_field("posting"));
                            }
                            posting__ = map_.next_value()?;
                        }
                        GeneratedField::MemoKey => {
                            if memo_key__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo_key"));
                            }
                            memo_key__ = map_.next_value()?;
                        }
                        GeneratedField::JsonMetadata => {
                            if json_metadata__.is_some() {
                                return Err(serde::de::Error::duplicate_field("json_metadata"));
                            }
                            json_metadata__ = Some(map_.next_value()?);
                        }
                        GeneratedField::PostingJsonMetadata => {
                            if posting_json_metadata__.is_some() {
                                return Err(serde::de::Error::duplicate_field("posting_json_metadata"));
                            }
                            posting_json_metadata__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(AccountUpdate2 {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    owner: owner__,
                    active: active__,
                    posting: posting__,
                    memo_key: memo_key__,
                    json_metadata: json_metadata__.ok_or_else(|| serde::de::Error::missing_field("json_metadata"))?,
                    posting_json_metadata: posting_json_metadata__.ok_or_else(|| serde::de::Error::missing_field("posting_json_metadata"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.account_update2", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for AccountWitnessProxy {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.account_witness_proxy", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("proxy", &self.proxy)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for AccountWitnessProxy {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "proxy",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            Proxy,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "proxy" => Ok(GeneratedField::Proxy),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = AccountWitnessProxy;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.account_witness_proxy")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<AccountWitnessProxy, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut proxy__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Proxy => {
                            if proxy__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proxy"));
                            }
                            proxy__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(AccountWitnessProxy {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    proxy: proxy__.ok_or_else(|| serde::de::Error::missing_field("proxy"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.account_witness_proxy", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for AccountWitnessVote {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.account_witness_vote", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("witness", &self.witness)?;
        struct_ser.serialize_field("approve", &self.approve)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for AccountWitnessVote {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "witness",
            "approve",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            Witness,
            Approve,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "witness" => Ok(GeneratedField::Witness),
                            "approve" => Ok(GeneratedField::Approve),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = AccountWitnessVote;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.account_witness_vote")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<AccountWitnessVote, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut witness__ = None;
                let mut approve__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Witness => {
                            if witness__.is_some() {
                                return Err(serde::de::Error::duplicate_field("witness"));
                            }
                            witness__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Approve => {
                            if approve__.is_some() {
                                return Err(serde::de::Error::duplicate_field("approve"));
                            }
                            approve__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(AccountWitnessVote {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    witness: witness__.ok_or_else(|| serde::de::Error::missing_field("witness"))?,
                    approve: approve__.ok_or_else(|| serde::de::Error::missing_field("approve"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.account_witness_vote", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Asset {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.asset", len)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.serialize_field("precision", &self.precision)?;
        struct_ser.serialize_field("nai", &self.nai)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Asset {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "amount",
            "precision",
            "nai",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Amount,
            Precision,
            Nai,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "amount" => Ok(GeneratedField::Amount),
                            "precision" => Ok(GeneratedField::Precision),
                            "nai" => Ok(GeneratedField::Nai),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Asset;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.asset")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Asset, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut amount__ = None;
                let mut precision__ = None;
                let mut nai__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Precision => {
                            if precision__.is_some() {
                                return Err(serde::de::Error::duplicate_field("precision"));
                            }
                            precision__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Nai => {
                            if nai__.is_some() {
                                return Err(serde::de::Error::duplicate_field("nai"));
                            }
                            nai__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(Asset {
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                    precision: precision__.ok_or_else(|| serde::de::Error::missing_field("precision"))?,
                    nai: nai__.ok_or_else(|| serde::de::Error::missing_field("nai"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.asset", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for AuthorReward {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 7;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.author_reward", len)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.serialize_field("hbd_payout", &self.hbd_payout)?;
        struct_ser.serialize_field("hive_payout", &self.hive_payout)?;
        struct_ser.serialize_field("vesting_payout", &self.vesting_payout)?;
        struct_ser.serialize_field("curators_vesting_payout", &self.curators_vesting_payout)?;
        struct_ser.serialize_field("payout_must_be_claimed", &self.payout_must_be_claimed)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for AuthorReward {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "author",
            "permlink",
            "hbd_payout",
            "hive_payout",
            "vesting_payout",
            "curators_vesting_payout",
            "payout_must_be_claimed",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Author,
            Permlink,
            HbdPayout,
            HivePayout,
            VestingPayout,
            CuratorsVestingPayout,
            PayoutMustBeClaimed,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "hbd_payout" => Ok(GeneratedField::HbdPayout),
                            "hive_payout" => Ok(GeneratedField::HivePayout),
                            "vesting_payout" => Ok(GeneratedField::VestingPayout),
                            "curators_vesting_payout" => Ok(GeneratedField::CuratorsVestingPayout),
                            "payout_must_be_claimed" => Ok(GeneratedField::PayoutMustBeClaimed),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = AuthorReward;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.author_reward")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<AuthorReward, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut author__ = None;
                let mut permlink__ = None;
                let mut hbd_payout__ = None;
                let mut hive_payout__ = None;
                let mut vesting_payout__ = None;
                let mut curators_vesting_payout__ = None;
                let mut payout_must_be_claimed__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::HbdPayout => {
                            if hbd_payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_payout"));
                            }
                            hbd_payout__ = map_.next_value()?;
                        }
                        GeneratedField::HivePayout => {
                            if hive_payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hive_payout"));
                            }
                            hive_payout__ = map_.next_value()?;
                        }
                        GeneratedField::VestingPayout => {
                            if vesting_payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_payout"));
                            }
                            vesting_payout__ = map_.next_value()?;
                        }
                        GeneratedField::CuratorsVestingPayout => {
                            if curators_vesting_payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("curators_vesting_payout"));
                            }
                            curators_vesting_payout__ = map_.next_value()?;
                        }
                        GeneratedField::PayoutMustBeClaimed => {
                            if payout_must_be_claimed__.is_some() {
                                return Err(serde::de::Error::duplicate_field("payout_must_be_claimed"));
                            }
                            payout_must_be_claimed__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(AuthorReward {
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    hbd_payout: hbd_payout__.ok_or_else(|| serde::de::Error::missing_field("hbd_payout"))?,
                    hive_payout: hive_payout__.ok_or_else(|| serde::de::Error::missing_field("hive_payout"))?,
                    vesting_payout: vesting_payout__.ok_or_else(|| serde::de::Error::missing_field("vesting_payout"))?,
                    curators_vesting_payout: curators_vesting_payout__.ok_or_else(|| serde::de::Error::missing_field("curators_vesting_payout"))?,
                    payout_must_be_claimed: payout_must_be_claimed__.ok_or_else(|| serde::de::Error::missing_field("payout_must_be_claimed"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.author_reward", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Authority {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 1;
        if !self.account_auths.is_empty() {
            len += 1;
        }
        if !self.key_auths.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.authority", len)?;
        struct_ser.serialize_field("weight_threshold", &self.weight_threshold)?;
        if !self.account_auths.is_empty() {
            struct_ser.serialize_field("account_auths", &self.account_auths)?;
        }
        if !self.key_auths.is_empty() {
            struct_ser.serialize_field("key_auths", &self.key_auths)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Authority {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "weight_threshold",
            "account_auths",
            "key_auths",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            WeightThreshold,
            AccountAuths,
            KeyAuths,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "weight_threshold" => Ok(GeneratedField::WeightThreshold),
                            "account_auths" => Ok(GeneratedField::AccountAuths),
                            "key_auths" => Ok(GeneratedField::KeyAuths),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Authority;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.authority")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Authority, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut weight_threshold__ = None;
                let mut account_auths__ = None;
                let mut key_auths__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::WeightThreshold => {
                            if weight_threshold__.is_some() {
                                return Err(serde::de::Error::duplicate_field("weight_threshold"));
                            }
                            weight_threshold__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::AccountAuths => {
                            if account_auths__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_auths"));
                            }
                            account_auths__ = Some(
                                map_.next_value::<std::collections::HashMap<_, ::pbjson::private::NumberDeserialize<u32>>>()?
                                    .into_iter().map(|(k,v)| (k, v.0)).collect()
                            );
                        }
                        GeneratedField::KeyAuths => {
                            if key_auths__.is_some() {
                                return Err(serde::de::Error::duplicate_field("key_auths"));
                            }
                            key_auths__ = Some(
                                map_.next_value::<std::collections::HashMap<_, ::pbjson::private::NumberDeserialize<u32>>>()?
                                    .into_iter().map(|(k,v)| (k, v.0)).collect()
                            );
                        }
                    }
                }
                Ok(Authority {
                    weight_threshold: weight_threshold__.ok_or_else(|| serde::de::Error::missing_field("weight_threshold"))?,
                    account_auths: account_auths__.unwrap_or_default(),
                    key_auths: key_auths__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.authority", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for BeneficiaryRouteType {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.beneficiary_route_type", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("weight", &self.weight)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for BeneficiaryRouteType {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "weight",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            Weight,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "weight" => Ok(GeneratedField::Weight),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = BeneficiaryRouteType;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.beneficiary_route_type")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<BeneficiaryRouteType, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut weight__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Weight => {
                            if weight__.is_some() {
                                return Err(serde::de::Error::duplicate_field("weight"));
                            }
                            weight__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(BeneficiaryRouteType {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    weight: weight__.ok_or_else(|| serde::de::Error::missing_field("weight"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.beneficiary_route_type", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Block {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 7;
        if !self.extensions.is_empty() {
            len += 1;
        }
        if !self.transactions.is_empty() {
            len += 1;
        }
        if !self.transaction_ids.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.block", len)?;
        struct_ser.serialize_field("previous", &self.previous)?;
        struct_ser.serialize_field("timestamp", &self.timestamp)?;
        struct_ser.serialize_field("witness", &self.witness)?;
        struct_ser.serialize_field("transaction_merkle_root", &self.transaction_merkle_root)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.serialize_field("witness_signature", &self.witness_signature)?;
        if !self.transactions.is_empty() {
            struct_ser.serialize_field("transactions", &self.transactions)?;
        }
        struct_ser.serialize_field("block_id", &self.block_id)?;
        struct_ser.serialize_field("signing_key", &self.signing_key)?;
        if !self.transaction_ids.is_empty() {
            struct_ser.serialize_field("transaction_ids", &self.transaction_ids)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Block {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "previous",
            "timestamp",
            "witness",
            "transaction_merkle_root",
            "extensions",
            "witness_signature",
            "transactions",
            "block_id",
            "signing_key",
            "transaction_ids",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Previous,
            Timestamp,
            Witness,
            TransactionMerkleRoot,
            Extensions,
            WitnessSignature,
            Transactions,
            BlockId,
            SigningKey,
            TransactionIds,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "previous" => Ok(GeneratedField::Previous),
                            "timestamp" => Ok(GeneratedField::Timestamp),
                            "witness" => Ok(GeneratedField::Witness),
                            "transaction_merkle_root" => Ok(GeneratedField::TransactionMerkleRoot),
                            "extensions" => Ok(GeneratedField::Extensions),
                            "witness_signature" => Ok(GeneratedField::WitnessSignature),
                            "transactions" => Ok(GeneratedField::Transactions),
                            "block_id" => Ok(GeneratedField::BlockId),
                            "signing_key" => Ok(GeneratedField::SigningKey),
                            "transaction_ids" => Ok(GeneratedField::TransactionIds),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Block;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.block")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Block, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut previous__ = None;
                let mut timestamp__ = None;
                let mut witness__ = None;
                let mut transaction_merkle_root__ = None;
                let mut extensions__ = None;
                let mut witness_signature__ = None;
                let mut transactions__ = None;
                let mut block_id__ = None;
                let mut signing_key__ = None;
                let mut transaction_ids__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Previous => {
                            if previous__.is_some() {
                                return Err(serde::de::Error::duplicate_field("previous"));
                            }
                            previous__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Timestamp => {
                            if timestamp__.is_some() {
                                return Err(serde::de::Error::duplicate_field("timestamp"));
                            }
                            timestamp__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Witness => {
                            if witness__.is_some() {
                                return Err(serde::de::Error::duplicate_field("witness"));
                            }
                            witness__ = Some(map_.next_value()?);
                        }
                        GeneratedField::TransactionMerkleRoot => {
                            if transaction_merkle_root__.is_some() {
                                return Err(serde::de::Error::duplicate_field("transaction_merkle_root"));
                            }
                            transaction_merkle_root__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                        GeneratedField::WitnessSignature => {
                            if witness_signature__.is_some() {
                                return Err(serde::de::Error::duplicate_field("witness_signature"));
                            }
                            witness_signature__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Transactions => {
                            if transactions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("transactions"));
                            }
                            transactions__ = Some(map_.next_value()?);
                        }
                        GeneratedField::BlockId => {
                            if block_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("block_id"));
                            }
                            block_id__ = Some(map_.next_value()?);
                        }
                        GeneratedField::SigningKey => {
                            if signing_key__.is_some() {
                                return Err(serde::de::Error::duplicate_field("signing_key"));
                            }
                            signing_key__ = Some(map_.next_value()?);
                        }
                        GeneratedField::TransactionIds => {
                            if transaction_ids__.is_some() {
                                return Err(serde::de::Error::duplicate_field("transaction_ids"));
                            }
                            transaction_ids__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(Block {
                    previous: previous__.ok_or_else(|| serde::de::Error::missing_field("previous"))?,
                    timestamp: timestamp__.ok_or_else(|| serde::de::Error::missing_field("timestamp"))?,
                    witness: witness__.ok_or_else(|| serde::de::Error::missing_field("witness"))?,
                    transaction_merkle_root: transaction_merkle_root__.ok_or_else(|| serde::de::Error::missing_field("transaction_merkle_root"))?,
                    extensions: extensions__.unwrap_or_default(),
                    witness_signature: witness_signature__.ok_or_else(|| serde::de::Error::missing_field("witness_signature"))?,
                    transactions: transactions__.unwrap_or_default(),
                    block_id: block_id__.ok_or_else(|| serde::de::Error::missing_field("block_id"))?,
                    signing_key: signing_key__.ok_or_else(|| serde::de::Error::missing_field("signing_key"))?,
                    transaction_ids: transaction_ids__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.block", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for BlockHeaderExtensions {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if self.value.is_some() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.block_header_extensions", len)?;
        if let Some(v) = self.value.as_ref() {
            match v {
                block_header_extensions::Value::VoidT(v) => {
                    struct_ser.serialize_field("void_t", v)?;
                }
                block_header_extensions::Value::Version(v) => {
                    struct_ser.serialize_field("version", v)?;
                }
                block_header_extensions::Value::HardforkVersionVote(v) => {
                    struct_ser.serialize_field("hardfork_version_vote", v)?;
                }
            }
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for BlockHeaderExtensions {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "void_t",
            "version",
            "hardfork_version_vote",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            VoidT,
            Version,
            HardforkVersionVote,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "void_t" => Ok(GeneratedField::VoidT),
                            "version" => Ok(GeneratedField::Version),
                            "hardfork_version_vote" => Ok(GeneratedField::HardforkVersionVote),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = BlockHeaderExtensions;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.block_header_extensions")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<BlockHeaderExtensions, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut value__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::VoidT => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("void_t"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(block_header_extensions::Value::VoidT)
;
                        }
                        GeneratedField::Version => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("version"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(block_header_extensions::Value::Version);
                        }
                        GeneratedField::HardforkVersionVote => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hardfork_version_vote"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(block_header_extensions::Value::HardforkVersionVote)
;
                        }
                    }
                }
                Ok(BlockHeaderExtensions {
                    value: value__,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.block_header_extensions", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CancelTransferFromSavings {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.cancel_transfer_from_savings", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("request_id", &self.request_id)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CancelTransferFromSavings {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "request_id",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            RequestId,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "request_id" => Ok(GeneratedField::RequestId),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CancelTransferFromSavings;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.cancel_transfer_from_savings")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CancelTransferFromSavings, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut request_id__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::RequestId => {
                            if request_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("request_id"));
                            }
                            request_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(CancelTransferFromSavings {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    request_id: request_id__.ok_or_else(|| serde::de::Error::missing_field("request_id"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.cancel_transfer_from_savings", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ChangeRecoveryAccount {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 2;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.change_recovery_account", len)?;
        struct_ser.serialize_field("account_to_recover", &self.account_to_recover)?;
        struct_ser.serialize_field("new_recovery_account", &self.new_recovery_account)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ChangeRecoveryAccount {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account_to_recover",
            "new_recovery_account",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            AccountToRecover,
            NewRecoveryAccount,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account_to_recover" => Ok(GeneratedField::AccountToRecover),
                            "new_recovery_account" => Ok(GeneratedField::NewRecoveryAccount),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ChangeRecoveryAccount;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.change_recovery_account")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ChangeRecoveryAccount, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account_to_recover__ = None;
                let mut new_recovery_account__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::AccountToRecover => {
                            if account_to_recover__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_to_recover"));
                            }
                            account_to_recover__ = Some(map_.next_value()?);
                        }
                        GeneratedField::NewRecoveryAccount => {
                            if new_recovery_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("new_recovery_account"));
                            }
                            new_recovery_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(ChangeRecoveryAccount {
                    account_to_recover: account_to_recover__.ok_or_else(|| serde::de::Error::missing_field("account_to_recover"))?,
                    new_recovery_account: new_recovery_account__.ok_or_else(|| serde::de::Error::missing_field("new_recovery_account"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.change_recovery_account", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ChangedRecoveryAccount {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.changed_recovery_account", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("old_recovery_account", &self.old_recovery_account)?;
        struct_ser.serialize_field("new_recovery_account", &self.new_recovery_account)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ChangedRecoveryAccount {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "old_recovery_account",
            "new_recovery_account",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            OldRecoveryAccount,
            NewRecoveryAccount,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "old_recovery_account" => Ok(GeneratedField::OldRecoveryAccount),
                            "new_recovery_account" => Ok(GeneratedField::NewRecoveryAccount),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ChangedRecoveryAccount;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.changed_recovery_account")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ChangedRecoveryAccount, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut old_recovery_account__ = None;
                let mut new_recovery_account__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::OldRecoveryAccount => {
                            if old_recovery_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("old_recovery_account"));
                            }
                            old_recovery_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::NewRecoveryAccount => {
                            if new_recovery_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("new_recovery_account"));
                            }
                            new_recovery_account__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(ChangedRecoveryAccount {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    old_recovery_account: old_recovery_account__.ok_or_else(|| serde::de::Error::missing_field("old_recovery_account"))?,
                    new_recovery_account: new_recovery_account__.ok_or_else(|| serde::de::Error::missing_field("new_recovery_account"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.changed_recovery_account", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ClaimAccount {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 2;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.claim_account", len)?;
        struct_ser.serialize_field("creator", &self.creator)?;
        struct_ser.serialize_field("fee", &self.fee)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ClaimAccount {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "creator",
            "fee",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Creator,
            Fee,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "creator" => Ok(GeneratedField::Creator),
                            "fee" => Ok(GeneratedField::Fee),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ClaimAccount;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.claim_account")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ClaimAccount, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut creator__ = None;
                let mut fee__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Creator => {
                            if creator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("creator"));
                            }
                            creator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Fee => {
                            if fee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fee"));
                            }
                            fee__ = map_.next_value()?;
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(ClaimAccount {
                    creator: creator__.ok_or_else(|| serde::de::Error::missing_field("creator"))?,
                    fee: fee__.ok_or_else(|| serde::de::Error::missing_field("fee"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.claim_account", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ClaimRewardBalance {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.claim_reward_balance", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("reward_hive", &self.reward_hive)?;
        struct_ser.serialize_field("reward_hbd", &self.reward_hbd)?;
        struct_ser.serialize_field("reward_vests", &self.reward_vests)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ClaimRewardBalance {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "reward_hive",
            "reward_hbd",
            "reward_vests",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            RewardHive,
            RewardHbd,
            RewardVests,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "reward_hive" => Ok(GeneratedField::RewardHive),
                            "reward_hbd" => Ok(GeneratedField::RewardHbd),
                            "reward_vests" => Ok(GeneratedField::RewardVests),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ClaimRewardBalance;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.claim_reward_balance")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ClaimRewardBalance, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut reward_hive__ = None;
                let mut reward_hbd__ = None;
                let mut reward_vests__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::RewardHive => {
                            if reward_hive__.is_some() {
                                return Err(serde::de::Error::duplicate_field("reward_hive"));
                            }
                            reward_hive__ = map_.next_value()?;
                        }
                        GeneratedField::RewardHbd => {
                            if reward_hbd__.is_some() {
                                return Err(serde::de::Error::duplicate_field("reward_hbd"));
                            }
                            reward_hbd__ = map_.next_value()?;
                        }
                        GeneratedField::RewardVests => {
                            if reward_vests__.is_some() {
                                return Err(serde::de::Error::duplicate_field("reward_vests"));
                            }
                            reward_vests__ = map_.next_value()?;
                        }
                    }
                }
                Ok(ClaimRewardBalance {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    reward_hive: reward_hive__.ok_or_else(|| serde::de::Error::missing_field("reward_hive"))?,
                    reward_hbd: reward_hbd__.ok_or_else(|| serde::de::Error::missing_field("reward_hbd"))?,
                    reward_vests: reward_vests__.ok_or_else(|| serde::de::Error::missing_field("reward_vests"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.claim_reward_balance", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ClearNullAccountBalance {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if !self.total_cleared.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.clear_null_account_balance", len)?;
        if !self.total_cleared.is_empty() {
            struct_ser.serialize_field("total_cleared", &self.total_cleared)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ClearNullAccountBalance {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "total_cleared",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            TotalCleared,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "total_cleared" => Ok(GeneratedField::TotalCleared),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ClearNullAccountBalance;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.clear_null_account_balance")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ClearNullAccountBalance, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut total_cleared__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::TotalCleared => {
                            if total_cleared__.is_some() {
                                return Err(serde::de::Error::duplicate_field("total_cleared"));
                            }
                            total_cleared__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(ClearNullAccountBalance {
                    total_cleared: total_cleared__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.clear_null_account_balance", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CollateralizedConvert {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.collateralized_convert", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("requestid", &self.requestid)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CollateralizedConvert {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "requestid",
            "amount",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Requestid,
            Amount,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "requestid" => Ok(GeneratedField::Requestid),
                            "amount" => Ok(GeneratedField::Amount),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CollateralizedConvert;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.collateralized_convert")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CollateralizedConvert, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut requestid__ = None;
                let mut amount__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Requestid => {
                            if requestid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("requestid"));
                            }
                            requestid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                    }
                }
                Ok(CollateralizedConvert {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    requestid: requestid__.ok_or_else(|| serde::de::Error::missing_field("requestid"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.collateralized_convert", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CollateralizedConvertImmediateConversion {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.collateralized_convert_immediate_conversion", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("requestid", &self.requestid)?;
        struct_ser.serialize_field("hbd_out", &self.hbd_out)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CollateralizedConvertImmediateConversion {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "requestid",
            "hbd_out",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Requestid,
            HbdOut,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "requestid" => Ok(GeneratedField::Requestid),
                            "hbd_out" => Ok(GeneratedField::HbdOut),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CollateralizedConvertImmediateConversion;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.collateralized_convert_immediate_conversion")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CollateralizedConvertImmediateConversion, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut requestid__ = None;
                let mut hbd_out__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Requestid => {
                            if requestid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("requestid"));
                            }
                            requestid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::HbdOut => {
                            if hbd_out__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_out"));
                            }
                            hbd_out__ = map_.next_value()?;
                        }
                    }
                }
                Ok(CollateralizedConvertImmediateConversion {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    requestid: requestid__.ok_or_else(|| serde::de::Error::missing_field("requestid"))?,
                    hbd_out: hbd_out__.ok_or_else(|| serde::de::Error::missing_field("hbd_out"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.collateralized_convert_immediate_conversion", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Comment {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 7;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.comment", len)?;
        struct_ser.serialize_field("parent_author", &self.parent_author)?;
        struct_ser.serialize_field("parent_permlink", &self.parent_permlink)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.serialize_field("title", &self.title)?;
        struct_ser.serialize_field("body", &self.body)?;
        struct_ser.serialize_field("json_metadata", &self.json_metadata)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Comment {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "parent_author",
            "parent_permlink",
            "author",
            "permlink",
            "title",
            "body",
            "json_metadata",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            ParentAuthor,
            ParentPermlink,
            Author,
            Permlink,
            Title,
            Body,
            JsonMetadata,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "parent_author" => Ok(GeneratedField::ParentAuthor),
                            "parent_permlink" => Ok(GeneratedField::ParentPermlink),
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "title" => Ok(GeneratedField::Title),
                            "body" => Ok(GeneratedField::Body),
                            "json_metadata" => Ok(GeneratedField::JsonMetadata),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Comment;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.comment")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Comment, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut parent_author__ = None;
                let mut parent_permlink__ = None;
                let mut author__ = None;
                let mut permlink__ = None;
                let mut title__ = None;
                let mut body__ = None;
                let mut json_metadata__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::ParentAuthor => {
                            if parent_author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("parent_author"));
                            }
                            parent_author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ParentPermlink => {
                            if parent_permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("parent_permlink"));
                            }
                            parent_permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Title => {
                            if title__.is_some() {
                                return Err(serde::de::Error::duplicate_field("title"));
                            }
                            title__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Body => {
                            if body__.is_some() {
                                return Err(serde::de::Error::duplicate_field("body"));
                            }
                            body__ = Some(map_.next_value()?);
                        }
                        GeneratedField::JsonMetadata => {
                            if json_metadata__.is_some() {
                                return Err(serde::de::Error::duplicate_field("json_metadata"));
                            }
                            json_metadata__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(Comment {
                    parent_author: parent_author__.ok_or_else(|| serde::de::Error::missing_field("parent_author"))?,
                    parent_permlink: parent_permlink__.ok_or_else(|| serde::de::Error::missing_field("parent_permlink"))?,
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    title: title__.ok_or_else(|| serde::de::Error::missing_field("title"))?,
                    body: body__.ok_or_else(|| serde::de::Error::missing_field("body"))?,
                    json_metadata: json_metadata__.ok_or_else(|| serde::de::Error::missing_field("json_metadata"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.comment", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CommentBenefactorReward {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 7;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.comment_benefactor_reward", len)?;
        struct_ser.serialize_field("benefactor", &self.benefactor)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.serialize_field("hbd_payout", &self.hbd_payout)?;
        struct_ser.serialize_field("hive_payout", &self.hive_payout)?;
        struct_ser.serialize_field("vesting_payout", &self.vesting_payout)?;
        struct_ser.serialize_field("payout_must_be_claimed", &self.payout_must_be_claimed)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CommentBenefactorReward {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "benefactor",
            "author",
            "permlink",
            "hbd_payout",
            "hive_payout",
            "vesting_payout",
            "payout_must_be_claimed",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Benefactor,
            Author,
            Permlink,
            HbdPayout,
            HivePayout,
            VestingPayout,
            PayoutMustBeClaimed,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "benefactor" => Ok(GeneratedField::Benefactor),
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "hbd_payout" => Ok(GeneratedField::HbdPayout),
                            "hive_payout" => Ok(GeneratedField::HivePayout),
                            "vesting_payout" => Ok(GeneratedField::VestingPayout),
                            "payout_must_be_claimed" => Ok(GeneratedField::PayoutMustBeClaimed),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CommentBenefactorReward;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.comment_benefactor_reward")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CommentBenefactorReward, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut benefactor__ = None;
                let mut author__ = None;
                let mut permlink__ = None;
                let mut hbd_payout__ = None;
                let mut hive_payout__ = None;
                let mut vesting_payout__ = None;
                let mut payout_must_be_claimed__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Benefactor => {
                            if benefactor__.is_some() {
                                return Err(serde::de::Error::duplicate_field("benefactor"));
                            }
                            benefactor__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::HbdPayout => {
                            if hbd_payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_payout"));
                            }
                            hbd_payout__ = map_.next_value()?;
                        }
                        GeneratedField::HivePayout => {
                            if hive_payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hive_payout"));
                            }
                            hive_payout__ = map_.next_value()?;
                        }
                        GeneratedField::VestingPayout => {
                            if vesting_payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_payout"));
                            }
                            vesting_payout__ = map_.next_value()?;
                        }
                        GeneratedField::PayoutMustBeClaimed => {
                            if payout_must_be_claimed__.is_some() {
                                return Err(serde::de::Error::duplicate_field("payout_must_be_claimed"));
                            }
                            payout_must_be_claimed__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(CommentBenefactorReward {
                    benefactor: benefactor__.ok_or_else(|| serde::de::Error::missing_field("benefactor"))?,
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    hbd_payout: hbd_payout__.ok_or_else(|| serde::de::Error::missing_field("hbd_payout"))?,
                    hive_payout: hive_payout__.ok_or_else(|| serde::de::Error::missing_field("hive_payout"))?,
                    vesting_payout: vesting_payout__.ok_or_else(|| serde::de::Error::missing_field("vesting_payout"))?,
                    payout_must_be_claimed: payout_must_be_claimed__.ok_or_else(|| serde::de::Error::missing_field("payout_must_be_claimed"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.comment_benefactor_reward", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CommentOptions {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 6;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.comment_options", len)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.serialize_field("max_accepted_payout", &self.max_accepted_payout)?;
        struct_ser.serialize_field("percent_hbd", &self.percent_hbd)?;
        struct_ser.serialize_field("allow_votes", &self.allow_votes)?;
        struct_ser.serialize_field("allow_curation_rewards", &self.allow_curation_rewards)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CommentOptions {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "author",
            "permlink",
            "max_accepted_payout",
            "percent_hbd",
            "allow_votes",
            "allow_curation_rewards",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Author,
            Permlink,
            MaxAcceptedPayout,
            PercentHbd,
            AllowVotes,
            AllowCurationRewards,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "max_accepted_payout" => Ok(GeneratedField::MaxAcceptedPayout),
                            "percent_hbd" => Ok(GeneratedField::PercentHbd),
                            "allow_votes" => Ok(GeneratedField::AllowVotes),
                            "allow_curation_rewards" => Ok(GeneratedField::AllowCurationRewards),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CommentOptions;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.comment_options")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CommentOptions, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut author__ = None;
                let mut permlink__ = None;
                let mut max_accepted_payout__ = None;
                let mut percent_hbd__ = None;
                let mut allow_votes__ = None;
                let mut allow_curation_rewards__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::MaxAcceptedPayout => {
                            if max_accepted_payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("max_accepted_payout"));
                            }
                            max_accepted_payout__ = map_.next_value()?;
                        }
                        GeneratedField::PercentHbd => {
                            if percent_hbd__.is_some() {
                                return Err(serde::de::Error::duplicate_field("percent_hbd"));
                            }
                            percent_hbd__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::AllowVotes => {
                            if allow_votes__.is_some() {
                                return Err(serde::de::Error::duplicate_field("allow_votes"));
                            }
                            allow_votes__ = Some(map_.next_value()?);
                        }
                        GeneratedField::AllowCurationRewards => {
                            if allow_curation_rewards__.is_some() {
                                return Err(serde::de::Error::duplicate_field("allow_curation_rewards"));
                            }
                            allow_curation_rewards__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(CommentOptions {
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    max_accepted_payout: max_accepted_payout__.ok_or_else(|| serde::de::Error::missing_field("max_accepted_payout"))?,
                    percent_hbd: percent_hbd__.ok_or_else(|| serde::de::Error::missing_field("percent_hbd"))?,
                    allow_votes: allow_votes__.ok_or_else(|| serde::de::Error::missing_field("allow_votes"))?,
                    allow_curation_rewards: allow_curation_rewards__.ok_or_else(|| serde::de::Error::missing_field("allow_curation_rewards"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.comment_options", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CommentOptionsExtension {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if self.value.is_some() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.comment_options_extension", len)?;
        if let Some(v) = self.value.as_ref() {
            match v {
                comment_options_extension::Value::CommentPayoutBeneficiaries(v) => {
                    struct_ser.serialize_field("comment_payout_beneficiaries", v)?;
                }
            }
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CommentOptionsExtension {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "comment_payout_beneficiaries",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            CommentPayoutBeneficiaries,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "comment_payout_beneficiaries" => Ok(GeneratedField::CommentPayoutBeneficiaries),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CommentOptionsExtension;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.comment_options_extension")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CommentOptionsExtension, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut value__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::CommentPayoutBeneficiaries => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("comment_payout_beneficiaries"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(comment_options_extension::Value::CommentPayoutBeneficiaries)
;
                        }
                    }
                }
                Ok(CommentOptionsExtension {
                    value: value__,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.comment_options_extension", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CommentPayoutBeneficiaries {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if !self.beneficiaries.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.comment_payout_beneficiaries", len)?;
        if !self.beneficiaries.is_empty() {
            struct_ser.serialize_field("beneficiaries", &self.beneficiaries)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CommentPayoutBeneficiaries {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "beneficiaries",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Beneficiaries,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "beneficiaries" => Ok(GeneratedField::Beneficiaries),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CommentPayoutBeneficiaries;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.comment_payout_beneficiaries")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CommentPayoutBeneficiaries, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut beneficiaries__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Beneficiaries => {
                            if beneficiaries__.is_some() {
                                return Err(serde::de::Error::duplicate_field("beneficiaries"));
                            }
                            beneficiaries__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(CommentPayoutBeneficiaries {
                    beneficiaries: beneficiaries__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.comment_payout_beneficiaries", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CommentPayoutUpdate {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.comment_payout_update", len)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CommentPayoutUpdate {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "author",
            "permlink",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Author,
            Permlink,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CommentPayoutUpdate;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.comment_payout_update")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CommentPayoutUpdate, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut author__ = None;
                let mut permlink__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(CommentPayoutUpdate {
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.comment_payout_update", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CommentReward {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 7;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.comment_reward", len)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.serialize_field("payout", &self.payout)?;
        #[allow(clippy::needless_borrow)]
        #[allow(clippy::needless_borrows_for_generic_args)]
        struct_ser.serialize_field("author_rewards", ToString::to_string(&self.author_rewards).as_str())?;
        struct_ser.serialize_field("total_payout_value", &self.total_payout_value)?;
        struct_ser.serialize_field("curator_payout_value", &self.curator_payout_value)?;
        struct_ser.serialize_field("beneficiary_payout_value", &self.beneficiary_payout_value)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CommentReward {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "author",
            "permlink",
            "payout",
            "author_rewards",
            "total_payout_value",
            "curator_payout_value",
            "beneficiary_payout_value",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Author,
            Permlink,
            Payout,
            AuthorRewards,
            TotalPayoutValue,
            CuratorPayoutValue,
            BeneficiaryPayoutValue,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "payout" => Ok(GeneratedField::Payout),
                            "author_rewards" => Ok(GeneratedField::AuthorRewards),
                            "total_payout_value" => Ok(GeneratedField::TotalPayoutValue),
                            "curator_payout_value" => Ok(GeneratedField::CuratorPayoutValue),
                            "beneficiary_payout_value" => Ok(GeneratedField::BeneficiaryPayoutValue),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CommentReward;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.comment_reward")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CommentReward, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut author__ = None;
                let mut permlink__ = None;
                let mut payout__ = None;
                let mut author_rewards__ = None;
                let mut total_payout_value__ = None;
                let mut curator_payout_value__ = None;
                let mut beneficiary_payout_value__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Payout => {
                            if payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("payout"));
                            }
                            payout__ = map_.next_value()?;
                        }
                        GeneratedField::AuthorRewards => {
                            if author_rewards__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author_rewards"));
                            }
                            author_rewards__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::TotalPayoutValue => {
                            if total_payout_value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("total_payout_value"));
                            }
                            total_payout_value__ = map_.next_value()?;
                        }
                        GeneratedField::CuratorPayoutValue => {
                            if curator_payout_value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("curator_payout_value"));
                            }
                            curator_payout_value__ = map_.next_value()?;
                        }
                        GeneratedField::BeneficiaryPayoutValue => {
                            if beneficiary_payout_value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("beneficiary_payout_value"));
                            }
                            beneficiary_payout_value__ = map_.next_value()?;
                        }
                    }
                }
                Ok(CommentReward {
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    payout: payout__.ok_or_else(|| serde::de::Error::missing_field("payout"))?,
                    author_rewards: author_rewards__.ok_or_else(|| serde::de::Error::missing_field("author_rewards"))?,
                    total_payout_value: total_payout_value__.ok_or_else(|| serde::de::Error::missing_field("total_payout_value"))?,
                    curator_payout_value: curator_payout_value__.ok_or_else(|| serde::de::Error::missing_field("curator_payout_value"))?,
                    beneficiary_payout_value: beneficiary_payout_value__.ok_or_else(|| serde::de::Error::missing_field("beneficiary_payout_value"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.comment_reward", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ConsolidateTreasuryBalance {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if !self.total_moved.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.consolidate_treasury_balance", len)?;
        if !self.total_moved.is_empty() {
            struct_ser.serialize_field("total_moved", &self.total_moved)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ConsolidateTreasuryBalance {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "total_moved",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            TotalMoved,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "total_moved" => Ok(GeneratedField::TotalMoved),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ConsolidateTreasuryBalance;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.consolidate_treasury_balance")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ConsolidateTreasuryBalance, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut total_moved__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::TotalMoved => {
                            if total_moved__.is_some() {
                                return Err(serde::de::Error::duplicate_field("total_moved"));
                            }
                            total_moved__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(ConsolidateTreasuryBalance {
                    total_moved: total_moved__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.consolidate_treasury_balance", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Convert {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.convert", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("requestid", &self.requestid)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Convert {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "requestid",
            "amount",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Requestid,
            Amount,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "requestid" => Ok(GeneratedField::Requestid),
                            "amount" => Ok(GeneratedField::Amount),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Convert;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.convert")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Convert, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut requestid__ = None;
                let mut amount__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Requestid => {
                            if requestid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("requestid"));
                            }
                            requestid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                    }
                }
                Ok(Convert {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    requestid: requestid__.ok_or_else(|| serde::de::Error::missing_field("requestid"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.convert", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CreateClaimedAccount {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 7;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.create_claimed_account", len)?;
        struct_ser.serialize_field("creator", &self.creator)?;
        struct_ser.serialize_field("new_account_name", &self.new_account_name)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("active", &self.active)?;
        struct_ser.serialize_field("posting", &self.posting)?;
        struct_ser.serialize_field("memo_key", &self.memo_key)?;
        struct_ser.serialize_field("json_metadata", &self.json_metadata)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CreateClaimedAccount {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "creator",
            "new_account_name",
            "owner",
            "active",
            "posting",
            "memo_key",
            "json_metadata",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Creator,
            NewAccountName,
            Owner,
            Active,
            Posting,
            MemoKey,
            JsonMetadata,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "creator" => Ok(GeneratedField::Creator),
                            "new_account_name" => Ok(GeneratedField::NewAccountName),
                            "owner" => Ok(GeneratedField::Owner),
                            "active" => Ok(GeneratedField::Active),
                            "posting" => Ok(GeneratedField::Posting),
                            "memo_key" => Ok(GeneratedField::MemoKey),
                            "json_metadata" => Ok(GeneratedField::JsonMetadata),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CreateClaimedAccount;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.create_claimed_account")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CreateClaimedAccount, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut creator__ = None;
                let mut new_account_name__ = None;
                let mut owner__ = None;
                let mut active__ = None;
                let mut posting__ = None;
                let mut memo_key__ = None;
                let mut json_metadata__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Creator => {
                            if creator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("creator"));
                            }
                            creator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::NewAccountName => {
                            if new_account_name__.is_some() {
                                return Err(serde::de::Error::duplicate_field("new_account_name"));
                            }
                            new_account_name__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = map_.next_value()?;
                        }
                        GeneratedField::Active => {
                            if active__.is_some() {
                                return Err(serde::de::Error::duplicate_field("active"));
                            }
                            active__ = map_.next_value()?;
                        }
                        GeneratedField::Posting => {
                            if posting__.is_some() {
                                return Err(serde::de::Error::duplicate_field("posting"));
                            }
                            posting__ = map_.next_value()?;
                        }
                        GeneratedField::MemoKey => {
                            if memo_key__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo_key"));
                            }
                            memo_key__ = Some(map_.next_value()?);
                        }
                        GeneratedField::JsonMetadata => {
                            if json_metadata__.is_some() {
                                return Err(serde::de::Error::duplicate_field("json_metadata"));
                            }
                            json_metadata__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(CreateClaimedAccount {
                    creator: creator__.ok_or_else(|| serde::de::Error::missing_field("creator"))?,
                    new_account_name: new_account_name__.ok_or_else(|| serde::de::Error::missing_field("new_account_name"))?,
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    active: active__.ok_or_else(|| serde::de::Error::missing_field("active"))?,
                    posting: posting__.ok_or_else(|| serde::de::Error::missing_field("posting"))?,
                    memo_key: memo_key__.ok_or_else(|| serde::de::Error::missing_field("memo_key"))?,
                    json_metadata: json_metadata__.ok_or_else(|| serde::de::Error::missing_field("json_metadata"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.create_claimed_account", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CreateProposal {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 7;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.create_proposal", len)?;
        struct_ser.serialize_field("creator", &self.creator)?;
        struct_ser.serialize_field("receiver", &self.receiver)?;
        struct_ser.serialize_field("start_date", &self.start_date)?;
        struct_ser.serialize_field("end_date", &self.end_date)?;
        struct_ser.serialize_field("daily_pay", &self.daily_pay)?;
        struct_ser.serialize_field("subject", &self.subject)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CreateProposal {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "creator",
            "receiver",
            "start_date",
            "end_date",
            "daily_pay",
            "subject",
            "permlink",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Creator,
            Receiver,
            StartDate,
            EndDate,
            DailyPay,
            Subject,
            Permlink,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "creator" => Ok(GeneratedField::Creator),
                            "receiver" => Ok(GeneratedField::Receiver),
                            "start_date" => Ok(GeneratedField::StartDate),
                            "end_date" => Ok(GeneratedField::EndDate),
                            "daily_pay" => Ok(GeneratedField::DailyPay),
                            "subject" => Ok(GeneratedField::Subject),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CreateProposal;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.create_proposal")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CreateProposal, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut creator__ = None;
                let mut receiver__ = None;
                let mut start_date__ = None;
                let mut end_date__ = None;
                let mut daily_pay__ = None;
                let mut subject__ = None;
                let mut permlink__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Creator => {
                            if creator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("creator"));
                            }
                            creator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Receiver => {
                            if receiver__.is_some() {
                                return Err(serde::de::Error::duplicate_field("receiver"));
                            }
                            receiver__ = Some(map_.next_value()?);
                        }
                        GeneratedField::StartDate => {
                            if start_date__.is_some() {
                                return Err(serde::de::Error::duplicate_field("start_date"));
                            }
                            start_date__ = Some(map_.next_value()?);
                        }
                        GeneratedField::EndDate => {
                            if end_date__.is_some() {
                                return Err(serde::de::Error::duplicate_field("end_date"));
                            }
                            end_date__ = Some(map_.next_value()?);
                        }
                        GeneratedField::DailyPay => {
                            if daily_pay__.is_some() {
                                return Err(serde::de::Error::duplicate_field("daily_pay"));
                            }
                            daily_pay__ = map_.next_value()?;
                        }
                        GeneratedField::Subject => {
                            if subject__.is_some() {
                                return Err(serde::de::Error::duplicate_field("subject"));
                            }
                            subject__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(CreateProposal {
                    creator: creator__.ok_or_else(|| serde::de::Error::missing_field("creator"))?,
                    receiver: receiver__.ok_or_else(|| serde::de::Error::missing_field("receiver"))?,
                    start_date: start_date__.ok_or_else(|| serde::de::Error::missing_field("start_date"))?,
                    end_date: end_date__.ok_or_else(|| serde::de::Error::missing_field("end_date"))?,
                    daily_pay: daily_pay__.ok_or_else(|| serde::de::Error::missing_field("daily_pay"))?,
                    subject: subject__.ok_or_else(|| serde::de::Error::missing_field("subject"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.create_proposal", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CurationReward {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 5;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.curation_reward", len)?;
        struct_ser.serialize_field("curator", &self.curator)?;
        struct_ser.serialize_field("reward", &self.reward)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.serialize_field("payout_must_be_claimed", &self.payout_must_be_claimed)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CurationReward {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "curator",
            "reward",
            "author",
            "permlink",
            "payout_must_be_claimed",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Curator,
            Reward,
            Author,
            Permlink,
            PayoutMustBeClaimed,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "curator" => Ok(GeneratedField::Curator),
                            "reward" => Ok(GeneratedField::Reward),
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "payout_must_be_claimed" => Ok(GeneratedField::PayoutMustBeClaimed),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CurationReward;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.curation_reward")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CurationReward, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut curator__ = None;
                let mut reward__ = None;
                let mut author__ = None;
                let mut permlink__ = None;
                let mut payout_must_be_claimed__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Curator => {
                            if curator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("curator"));
                            }
                            curator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Reward => {
                            if reward__.is_some() {
                                return Err(serde::de::Error::duplicate_field("reward"));
                            }
                            reward__ = map_.next_value()?;
                        }
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::PayoutMustBeClaimed => {
                            if payout_must_be_claimed__.is_some() {
                                return Err(serde::de::Error::duplicate_field("payout_must_be_claimed"));
                            }
                            payout_must_be_claimed__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(CurationReward {
                    curator: curator__.ok_or_else(|| serde::de::Error::missing_field("curator"))?,
                    reward: reward__.ok_or_else(|| serde::de::Error::missing_field("reward"))?,
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    payout_must_be_claimed: payout_must_be_claimed__.ok_or_else(|| serde::de::Error::missing_field("payout_must_be_claimed"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.curation_reward", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Custom {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 2;
        if !self.required_auths.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.custom", len)?;
        if !self.required_auths.is_empty() {
            struct_ser.serialize_field("required_auths", &self.required_auths)?;
        }
        struct_ser.serialize_field("id", &self.id)?;
        struct_ser.serialize_field("data", &self.data)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Custom {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "required_auths",
            "id",
            "data",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            RequiredAuths,
            Id,
            Data,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "required_auths" => Ok(GeneratedField::RequiredAuths),
                            "id" => Ok(GeneratedField::Id),
                            "data" => Ok(GeneratedField::Data),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Custom;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.custom")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Custom, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut required_auths__ = None;
                let mut id__ = None;
                let mut data__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::RequiredAuths => {
                            if required_auths__.is_some() {
                                return Err(serde::de::Error::duplicate_field("required_auths"));
                            }
                            required_auths__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Id => {
                            if id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("id"));
                            }
                            id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Data => {
                            if data__.is_some() {
                                return Err(serde::de::Error::duplicate_field("data"));
                            }
                            data__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(Custom {
                    required_auths: required_auths__.unwrap_or_default(),
                    id: id__.ok_or_else(|| serde::de::Error::missing_field("id"))?,
                    data: data__.ok_or_else(|| serde::de::Error::missing_field("data"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.custom", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for CustomJson {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 2;
        if !self.required_auths.is_empty() {
            len += 1;
        }
        if !self.required_posting_auths.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.custom_json", len)?;
        if !self.required_auths.is_empty() {
            struct_ser.serialize_field("required_auths", &self.required_auths)?;
        }
        if !self.required_posting_auths.is_empty() {
            struct_ser.serialize_field("required_posting_auths", &self.required_posting_auths)?;
        }
        struct_ser.serialize_field("id", &self.id)?;
        struct_ser.serialize_field("json", &self.json)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for CustomJson {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "required_auths",
            "required_posting_auths",
            "id",
            "json",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            RequiredAuths,
            RequiredPostingAuths,
            Id,
            Json,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "required_auths" => Ok(GeneratedField::RequiredAuths),
                            "required_posting_auths" => Ok(GeneratedField::RequiredPostingAuths),
                            "id" => Ok(GeneratedField::Id),
                            "json" => Ok(GeneratedField::Json),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = CustomJson;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.custom_json")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<CustomJson, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut required_auths__ = None;
                let mut required_posting_auths__ = None;
                let mut id__ = None;
                let mut json__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::RequiredAuths => {
                            if required_auths__.is_some() {
                                return Err(serde::de::Error::duplicate_field("required_auths"));
                            }
                            required_auths__ = Some(map_.next_value()?);
                        }
                        GeneratedField::RequiredPostingAuths => {
                            if required_posting_auths__.is_some() {
                                return Err(serde::de::Error::duplicate_field("required_posting_auths"));
                            }
                            required_posting_auths__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Id => {
                            if id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("id"));
                            }
                            id__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Json => {
                            if json__.is_some() {
                                return Err(serde::de::Error::duplicate_field("json"));
                            }
                            json__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(CustomJson {
                    required_auths: required_auths__.unwrap_or_default(),
                    required_posting_auths: required_posting_auths__.unwrap_or_default(),
                    id: id__.ok_or_else(|| serde::de::Error::missing_field("id"))?,
                    json: json__.ok_or_else(|| serde::de::Error::missing_field("json"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.custom_json", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for DeclineVotingRights {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.decline_voting_rights", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("decline", &self.decline)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for DeclineVotingRights {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "decline",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            Decline,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "decline" => Ok(GeneratedField::Decline),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = DeclineVotingRights;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.decline_voting_rights")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<DeclineVotingRights, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut decline__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Decline => {
                            if decline__.is_some() {
                                return Err(serde::de::Error::duplicate_field("decline"));
                            }
                            decline__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(DeclineVotingRights {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    decline: decline__.ok_or_else(|| serde::de::Error::missing_field("decline"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.decline_voting_rights", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for DeclinedVotingRights {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 1;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.declined_voting_rights", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for DeclinedVotingRights {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = DeclinedVotingRights;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.declined_voting_rights")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<DeclinedVotingRights, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(DeclinedVotingRights {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.declined_voting_rights", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for DelayedVoting {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.delayed_voting", len)?;
        struct_ser.serialize_field("voter", &self.voter)?;
        #[allow(clippy::needless_borrow)]
        #[allow(clippy::needless_borrows_for_generic_args)]
        struct_ser.serialize_field("votes", ToString::to_string(&self.votes).as_str())?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for DelayedVoting {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "voter",
            "votes",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Voter,
            Votes,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "voter" => Ok(GeneratedField::Voter),
                            "votes" => Ok(GeneratedField::Votes),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = DelayedVoting;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.delayed_voting")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<DelayedVoting, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut voter__ = None;
                let mut votes__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Voter => {
                            if voter__.is_some() {
                                return Err(serde::de::Error::duplicate_field("voter"));
                            }
                            voter__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Votes => {
                            if votes__.is_some() {
                                return Err(serde::de::Error::duplicate_field("votes"));
                            }
                            votes__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(DelayedVoting {
                    voter: voter__.ok_or_else(|| serde::de::Error::missing_field("voter"))?,
                    votes: votes__.ok_or_else(|| serde::de::Error::missing_field("votes"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.delayed_voting", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for DelegateVestingShares {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.delegate_vesting_shares", len)?;
        struct_ser.serialize_field("delegator", &self.delegator)?;
        struct_ser.serialize_field("delegatee", &self.delegatee)?;
        struct_ser.serialize_field("vesting_shares", &self.vesting_shares)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for DelegateVestingShares {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "delegator",
            "delegatee",
            "vesting_shares",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Delegator,
            Delegatee,
            VestingShares,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "delegator" => Ok(GeneratedField::Delegator),
                            "delegatee" => Ok(GeneratedField::Delegatee),
                            "vesting_shares" => Ok(GeneratedField::VestingShares),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = DelegateVestingShares;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.delegate_vesting_shares")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<DelegateVestingShares, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut delegator__ = None;
                let mut delegatee__ = None;
                let mut vesting_shares__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Delegator => {
                            if delegator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("delegator"));
                            }
                            delegator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Delegatee => {
                            if delegatee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("delegatee"));
                            }
                            delegatee__ = Some(map_.next_value()?);
                        }
                        GeneratedField::VestingShares => {
                            if vesting_shares__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_shares"));
                            }
                            vesting_shares__ = map_.next_value()?;
                        }
                    }
                }
                Ok(DelegateVestingShares {
                    delegator: delegator__.ok_or_else(|| serde::de::Error::missing_field("delegator"))?,
                    delegatee: delegatee__.ok_or_else(|| serde::de::Error::missing_field("delegatee"))?,
                    vesting_shares: vesting_shares__.ok_or_else(|| serde::de::Error::missing_field("vesting_shares"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.delegate_vesting_shares", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for DeleteComment {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.delete_comment", len)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for DeleteComment {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "author",
            "permlink",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Author,
            Permlink,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = DeleteComment;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.delete_comment")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<DeleteComment, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut author__ = None;
                let mut permlink__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(DeleteComment {
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.delete_comment", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for DhfConversion {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.dhf_conversion", len)?;
        struct_ser.serialize_field("treasury", &self.treasury)?;
        struct_ser.serialize_field("hive_amount_in", &self.hive_amount_in)?;
        struct_ser.serialize_field("hbd_amount_out", &self.hbd_amount_out)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for DhfConversion {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "treasury",
            "hive_amount_in",
            "hbd_amount_out",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Treasury,
            HiveAmountIn,
            HbdAmountOut,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "treasury" => Ok(GeneratedField::Treasury),
                            "hive_amount_in" => Ok(GeneratedField::HiveAmountIn),
                            "hbd_amount_out" => Ok(GeneratedField::HbdAmountOut),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = DhfConversion;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.dhf_conversion")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<DhfConversion, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut treasury__ = None;
                let mut hive_amount_in__ = None;
                let mut hbd_amount_out__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Treasury => {
                            if treasury__.is_some() {
                                return Err(serde::de::Error::duplicate_field("treasury"));
                            }
                            treasury__ = Some(map_.next_value()?);
                        }
                        GeneratedField::HiveAmountIn => {
                            if hive_amount_in__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hive_amount_in"));
                            }
                            hive_amount_in__ = map_.next_value()?;
                        }
                        GeneratedField::HbdAmountOut => {
                            if hbd_amount_out__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_amount_out"));
                            }
                            hbd_amount_out__ = map_.next_value()?;
                        }
                    }
                }
                Ok(DhfConversion {
                    treasury: treasury__.ok_or_else(|| serde::de::Error::missing_field("treasury"))?,
                    hive_amount_in: hive_amount_in__.ok_or_else(|| serde::de::Error::missing_field("hive_amount_in"))?,
                    hbd_amount_out: hbd_amount_out__.ok_or_else(|| serde::de::Error::missing_field("hbd_amount_out"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.dhf_conversion", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for DhfFunding {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.dhf_funding", len)?;
        struct_ser.serialize_field("treasury", &self.treasury)?;
        struct_ser.serialize_field("additional_funds", &self.additional_funds)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for DhfFunding {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "treasury",
            "additional_funds",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Treasury,
            AdditionalFunds,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "treasury" => Ok(GeneratedField::Treasury),
                            "additional_funds" => Ok(GeneratedField::AdditionalFunds),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = DhfFunding;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.dhf_funding")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<DhfFunding, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut treasury__ = None;
                let mut additional_funds__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Treasury => {
                            if treasury__.is_some() {
                                return Err(serde::de::Error::duplicate_field("treasury"));
                            }
                            treasury__ = Some(map_.next_value()?);
                        }
                        GeneratedField::AdditionalFunds => {
                            if additional_funds__.is_some() {
                                return Err(serde::de::Error::duplicate_field("additional_funds"));
                            }
                            additional_funds__ = map_.next_value()?;
                        }
                    }
                }
                Ok(DhfFunding {
                    treasury: treasury__.ok_or_else(|| serde::de::Error::missing_field("treasury"))?,
                    additional_funds: additional_funds__.ok_or_else(|| serde::de::Error::missing_field("additional_funds"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.dhf_funding", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for EffectiveCommentVote {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 7;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.effective_comment_vote", len)?;
        struct_ser.serialize_field("voter", &self.voter)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        #[allow(clippy::needless_borrow)]
        #[allow(clippy::needless_borrows_for_generic_args)]
        struct_ser.serialize_field("weight", ToString::to_string(&self.weight).as_str())?;
        #[allow(clippy::needless_borrow)]
        #[allow(clippy::needless_borrows_for_generic_args)]
        struct_ser.serialize_field("rshares", ToString::to_string(&self.rshares).as_str())?;
        #[allow(clippy::needless_borrow)]
        #[allow(clippy::needless_borrows_for_generic_args)]
        struct_ser.serialize_field("total_vote_weight", ToString::to_string(&self.total_vote_weight).as_str())?;
        struct_ser.serialize_field("pending_payout", &self.pending_payout)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for EffectiveCommentVote {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "voter",
            "author",
            "permlink",
            "weight",
            "rshares",
            "total_vote_weight",
            "pending_payout",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Voter,
            Author,
            Permlink,
            Weight,
            Rshares,
            TotalVoteWeight,
            PendingPayout,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "voter" => Ok(GeneratedField::Voter),
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "weight" => Ok(GeneratedField::Weight),
                            "rshares" => Ok(GeneratedField::Rshares),
                            "total_vote_weight" => Ok(GeneratedField::TotalVoteWeight),
                            "pending_payout" => Ok(GeneratedField::PendingPayout),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = EffectiveCommentVote;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.effective_comment_vote")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<EffectiveCommentVote, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut voter__ = None;
                let mut author__ = None;
                let mut permlink__ = None;
                let mut weight__ = None;
                let mut rshares__ = None;
                let mut total_vote_weight__ = None;
                let mut pending_payout__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Voter => {
                            if voter__.is_some() {
                                return Err(serde::de::Error::duplicate_field("voter"));
                            }
                            voter__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Weight => {
                            if weight__.is_some() {
                                return Err(serde::de::Error::duplicate_field("weight"));
                            }
                            weight__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Rshares => {
                            if rshares__.is_some() {
                                return Err(serde::de::Error::duplicate_field("rshares"));
                            }
                            rshares__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::TotalVoteWeight => {
                            if total_vote_weight__.is_some() {
                                return Err(serde::de::Error::duplicate_field("total_vote_weight"));
                            }
                            total_vote_weight__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::PendingPayout => {
                            if pending_payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("pending_payout"));
                            }
                            pending_payout__ = map_.next_value()?;
                        }
                    }
                }
                Ok(EffectiveCommentVote {
                    voter: voter__.ok_or_else(|| serde::de::Error::missing_field("voter"))?,
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    weight: weight__.ok_or_else(|| serde::de::Error::missing_field("weight"))?,
                    rshares: rshares__.ok_or_else(|| serde::de::Error::missing_field("rshares"))?,
                    total_vote_weight: total_vote_weight__.ok_or_else(|| serde::de::Error::missing_field("total_vote_weight"))?,
                    pending_payout: pending_payout__.ok_or_else(|| serde::de::Error::missing_field("pending_payout"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.effective_comment_vote", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for EquihashPow {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.equihash_pow", len)?;
        struct_ser.serialize_field("input", &self.input)?;
        struct_ser.serialize_field("proof", &self.proof)?;
        struct_ser.serialize_field("prev_block", &self.prev_block)?;
        struct_ser.serialize_field("pow_summary", &self.pow_summary)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for EquihashPow {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "input",
            "proof",
            "prev_block",
            "pow_summary",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Input,
            Proof,
            PrevBlock,
            PowSummary,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "input" => Ok(GeneratedField::Input),
                            "proof" => Ok(GeneratedField::Proof),
                            "prev_block" => Ok(GeneratedField::PrevBlock),
                            "pow_summary" => Ok(GeneratedField::PowSummary),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = EquihashPow;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.equihash_pow")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<EquihashPow, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut input__ = None;
                let mut proof__ = None;
                let mut prev_block__ = None;
                let mut pow_summary__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Input => {
                            if input__.is_some() {
                                return Err(serde::de::Error::duplicate_field("input"));
                            }
                            input__ = map_.next_value()?;
                        }
                        GeneratedField::Proof => {
                            if proof__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proof"));
                            }
                            proof__ = map_.next_value()?;
                        }
                        GeneratedField::PrevBlock => {
                            if prev_block__.is_some() {
                                return Err(serde::de::Error::duplicate_field("prev_block"));
                            }
                            prev_block__ = Some(map_.next_value()?);
                        }
                        GeneratedField::PowSummary => {
                            if pow_summary__.is_some() {
                                return Err(serde::de::Error::duplicate_field("pow_summary"));
                            }
                            pow_summary__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(EquihashPow {
                    input: input__.ok_or_else(|| serde::de::Error::missing_field("input"))?,
                    proof: proof__.ok_or_else(|| serde::de::Error::missing_field("proof"))?,
                    prev_block: prev_block__.ok_or_else(|| serde::de::Error::missing_field("prev_block"))?,
                    pow_summary: pow_summary__.ok_or_else(|| serde::de::Error::missing_field("pow_summary"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.equihash_pow", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for EquihashProof {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 3;
        if !self.inputs.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.equihash_proof", len)?;
        struct_ser.serialize_field("n", &self.n)?;
        struct_ser.serialize_field("k", &self.k)?;
        struct_ser.serialize_field("seed", &self.seed)?;
        if !self.inputs.is_empty() {
            struct_ser.serialize_field("inputs", &self.inputs)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for EquihashProof {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "n",
            "k",
            "seed",
            "inputs",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            N,
            K,
            Seed,
            Inputs,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "n" => Ok(GeneratedField::N),
                            "k" => Ok(GeneratedField::K),
                            "seed" => Ok(GeneratedField::Seed),
                            "inputs" => Ok(GeneratedField::Inputs),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = EquihashProof;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.equihash_proof")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<EquihashProof, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut n__ = None;
                let mut k__ = None;
                let mut seed__ = None;
                let mut inputs__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::N => {
                            if n__.is_some() {
                                return Err(serde::de::Error::duplicate_field("n"));
                            }
                            n__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::K => {
                            if k__.is_some() {
                                return Err(serde::de::Error::duplicate_field("k"));
                            }
                            k__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Seed => {
                            if seed__.is_some() {
                                return Err(serde::de::Error::duplicate_field("seed"));
                            }
                            seed__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Inputs => {
                            if inputs__.is_some() {
                                return Err(serde::de::Error::duplicate_field("inputs"));
                            }
                            inputs__ = 
                                Some(map_.next_value::<Vec<::pbjson::private::NumberDeserialize<_>>>()?
                                    .into_iter().map(|x| x.0).collect())
                            ;
                        }
                    }
                }
                Ok(EquihashProof {
                    n: n__.ok_or_else(|| serde::de::Error::missing_field("n"))?,
                    k: k__.ok_or_else(|| serde::de::Error::missing_field("k"))?,
                    seed: seed__.ok_or_else(|| serde::de::Error::missing_field("seed"))?,
                    inputs: inputs__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.equihash_proof", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for EscrowApprove {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 6;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.escrow_approve", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("agent", &self.agent)?;
        struct_ser.serialize_field("who", &self.who)?;
        struct_ser.serialize_field("escrow_id", &self.escrow_id)?;
        struct_ser.serialize_field("approve", &self.approve)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for EscrowApprove {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "agent",
            "who",
            "escrow_id",
            "approve",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Agent,
            Who,
            EscrowId,
            Approve,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "agent" => Ok(GeneratedField::Agent),
                            "who" => Ok(GeneratedField::Who),
                            "escrow_id" => Ok(GeneratedField::EscrowId),
                            "approve" => Ok(GeneratedField::Approve),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = EscrowApprove;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.escrow_approve")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<EscrowApprove, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut agent__ = None;
                let mut who__ = None;
                let mut escrow_id__ = None;
                let mut approve__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Agent => {
                            if agent__.is_some() {
                                return Err(serde::de::Error::duplicate_field("agent"));
                            }
                            agent__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Who => {
                            if who__.is_some() {
                                return Err(serde::de::Error::duplicate_field("who"));
                            }
                            who__ = Some(map_.next_value()?);
                        }
                        GeneratedField::EscrowId => {
                            if escrow_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_id"));
                            }
                            escrow_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Approve => {
                            if approve__.is_some() {
                                return Err(serde::de::Error::duplicate_field("approve"));
                            }
                            approve__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(EscrowApprove {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    agent: agent__.ok_or_else(|| serde::de::Error::missing_field("agent"))?,
                    who: who__.ok_or_else(|| serde::de::Error::missing_field("who"))?,
                    escrow_id: escrow_id__.ok_or_else(|| serde::de::Error::missing_field("escrow_id"))?,
                    approve: approve__.ok_or_else(|| serde::de::Error::missing_field("approve"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.escrow_approve", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for EscrowApproved {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 5;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.escrow_approved", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("agent", &self.agent)?;
        struct_ser.serialize_field("escrow_id", &self.escrow_id)?;
        struct_ser.serialize_field("fee", &self.fee)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for EscrowApproved {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "agent",
            "escrow_id",
            "fee",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Agent,
            EscrowId,
            Fee,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "agent" => Ok(GeneratedField::Agent),
                            "escrow_id" => Ok(GeneratedField::EscrowId),
                            "fee" => Ok(GeneratedField::Fee),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = EscrowApproved;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.escrow_approved")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<EscrowApproved, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut agent__ = None;
                let mut escrow_id__ = None;
                let mut fee__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Agent => {
                            if agent__.is_some() {
                                return Err(serde::de::Error::duplicate_field("agent"));
                            }
                            agent__ = Some(map_.next_value()?);
                        }
                        GeneratedField::EscrowId => {
                            if escrow_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_id"));
                            }
                            escrow_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Fee => {
                            if fee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fee"));
                            }
                            fee__ = map_.next_value()?;
                        }
                    }
                }
                Ok(EscrowApproved {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    agent: agent__.ok_or_else(|| serde::de::Error::missing_field("agent"))?,
                    escrow_id: escrow_id__.ok_or_else(|| serde::de::Error::missing_field("escrow_id"))?,
                    fee: fee__.ok_or_else(|| serde::de::Error::missing_field("fee"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.escrow_approved", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for EscrowDispute {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 5;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.escrow_dispute", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("agent", &self.agent)?;
        struct_ser.serialize_field("who", &self.who)?;
        struct_ser.serialize_field("escrow_id", &self.escrow_id)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for EscrowDispute {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "agent",
            "who",
            "escrow_id",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Agent,
            Who,
            EscrowId,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "agent" => Ok(GeneratedField::Agent),
                            "who" => Ok(GeneratedField::Who),
                            "escrow_id" => Ok(GeneratedField::EscrowId),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = EscrowDispute;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.escrow_dispute")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<EscrowDispute, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut agent__ = None;
                let mut who__ = None;
                let mut escrow_id__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Agent => {
                            if agent__.is_some() {
                                return Err(serde::de::Error::duplicate_field("agent"));
                            }
                            agent__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Who => {
                            if who__.is_some() {
                                return Err(serde::de::Error::duplicate_field("who"));
                            }
                            who__ = Some(map_.next_value()?);
                        }
                        GeneratedField::EscrowId => {
                            if escrow_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_id"));
                            }
                            escrow_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(EscrowDispute {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    agent: agent__.ok_or_else(|| serde::de::Error::missing_field("agent"))?,
                    who: who__.ok_or_else(|| serde::de::Error::missing_field("who"))?,
                    escrow_id: escrow_id__.ok_or_else(|| serde::de::Error::missing_field("escrow_id"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.escrow_dispute", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for EscrowRejected {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 7;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.escrow_rejected", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("agent", &self.agent)?;
        struct_ser.serialize_field("escrow_id", &self.escrow_id)?;
        struct_ser.serialize_field("hbd_amount", &self.hbd_amount)?;
        struct_ser.serialize_field("hive_amount", &self.hive_amount)?;
        struct_ser.serialize_field("fee", &self.fee)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for EscrowRejected {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "agent",
            "escrow_id",
            "hbd_amount",
            "hive_amount",
            "fee",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Agent,
            EscrowId,
            HbdAmount,
            HiveAmount,
            Fee,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "agent" => Ok(GeneratedField::Agent),
                            "escrow_id" => Ok(GeneratedField::EscrowId),
                            "hbd_amount" => Ok(GeneratedField::HbdAmount),
                            "hive_amount" => Ok(GeneratedField::HiveAmount),
                            "fee" => Ok(GeneratedField::Fee),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = EscrowRejected;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.escrow_rejected")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<EscrowRejected, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut agent__ = None;
                let mut escrow_id__ = None;
                let mut hbd_amount__ = None;
                let mut hive_amount__ = None;
                let mut fee__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Agent => {
                            if agent__.is_some() {
                                return Err(serde::de::Error::duplicate_field("agent"));
                            }
                            agent__ = Some(map_.next_value()?);
                        }
                        GeneratedField::EscrowId => {
                            if escrow_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_id"));
                            }
                            escrow_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::HbdAmount => {
                            if hbd_amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_amount"));
                            }
                            hbd_amount__ = map_.next_value()?;
                        }
                        GeneratedField::HiveAmount => {
                            if hive_amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hive_amount"));
                            }
                            hive_amount__ = map_.next_value()?;
                        }
                        GeneratedField::Fee => {
                            if fee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fee"));
                            }
                            fee__ = map_.next_value()?;
                        }
                    }
                }
                Ok(EscrowRejected {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    agent: agent__.ok_or_else(|| serde::de::Error::missing_field("agent"))?,
                    escrow_id: escrow_id__.ok_or_else(|| serde::de::Error::missing_field("escrow_id"))?,
                    hbd_amount: hbd_amount__.ok_or_else(|| serde::de::Error::missing_field("hbd_amount"))?,
                    hive_amount: hive_amount__.ok_or_else(|| serde::de::Error::missing_field("hive_amount"))?,
                    fee: fee__.ok_or_else(|| serde::de::Error::missing_field("fee"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.escrow_rejected", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for EscrowRelease {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 8;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.escrow_release", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("agent", &self.agent)?;
        struct_ser.serialize_field("who", &self.who)?;
        struct_ser.serialize_field("receiver", &self.receiver)?;
        struct_ser.serialize_field("escrow_id", &self.escrow_id)?;
        struct_ser.serialize_field("hbd_amount", &self.hbd_amount)?;
        struct_ser.serialize_field("hive_amount", &self.hive_amount)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for EscrowRelease {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "agent",
            "who",
            "receiver",
            "escrow_id",
            "hbd_amount",
            "hive_amount",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Agent,
            Who,
            Receiver,
            EscrowId,
            HbdAmount,
            HiveAmount,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "agent" => Ok(GeneratedField::Agent),
                            "who" => Ok(GeneratedField::Who),
                            "receiver" => Ok(GeneratedField::Receiver),
                            "escrow_id" => Ok(GeneratedField::EscrowId),
                            "hbd_amount" => Ok(GeneratedField::HbdAmount),
                            "hive_amount" => Ok(GeneratedField::HiveAmount),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = EscrowRelease;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.escrow_release")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<EscrowRelease, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut agent__ = None;
                let mut who__ = None;
                let mut receiver__ = None;
                let mut escrow_id__ = None;
                let mut hbd_amount__ = None;
                let mut hive_amount__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Agent => {
                            if agent__.is_some() {
                                return Err(serde::de::Error::duplicate_field("agent"));
                            }
                            agent__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Who => {
                            if who__.is_some() {
                                return Err(serde::de::Error::duplicate_field("who"));
                            }
                            who__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Receiver => {
                            if receiver__.is_some() {
                                return Err(serde::de::Error::duplicate_field("receiver"));
                            }
                            receiver__ = Some(map_.next_value()?);
                        }
                        GeneratedField::EscrowId => {
                            if escrow_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_id"));
                            }
                            escrow_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::HbdAmount => {
                            if hbd_amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_amount"));
                            }
                            hbd_amount__ = map_.next_value()?;
                        }
                        GeneratedField::HiveAmount => {
                            if hive_amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hive_amount"));
                            }
                            hive_amount__ = map_.next_value()?;
                        }
                    }
                }
                Ok(EscrowRelease {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    agent: agent__.ok_or_else(|| serde::de::Error::missing_field("agent"))?,
                    who: who__.ok_or_else(|| serde::de::Error::missing_field("who"))?,
                    receiver: receiver__.ok_or_else(|| serde::de::Error::missing_field("receiver"))?,
                    escrow_id: escrow_id__.ok_or_else(|| serde::de::Error::missing_field("escrow_id"))?,
                    hbd_amount: hbd_amount__.ok_or_else(|| serde::de::Error::missing_field("hbd_amount"))?,
                    hive_amount: hive_amount__.ok_or_else(|| serde::de::Error::missing_field("hive_amount"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.escrow_release", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for EscrowTransfer {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 10;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.escrow_transfer", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("agent", &self.agent)?;
        struct_ser.serialize_field("escrow_id", &self.escrow_id)?;
        struct_ser.serialize_field("hbd_amount", &self.hbd_amount)?;
        struct_ser.serialize_field("hive_amount", &self.hive_amount)?;
        struct_ser.serialize_field("fee", &self.fee)?;
        struct_ser.serialize_field("ratification_deadline", &self.ratification_deadline)?;
        struct_ser.serialize_field("escrow_expiration", &self.escrow_expiration)?;
        struct_ser.serialize_field("json_meta", &self.json_meta)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for EscrowTransfer {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "agent",
            "escrow_id",
            "hbd_amount",
            "hive_amount",
            "fee",
            "ratification_deadline",
            "escrow_expiration",
            "json_meta",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Agent,
            EscrowId,
            HbdAmount,
            HiveAmount,
            Fee,
            RatificationDeadline,
            EscrowExpiration,
            JsonMeta,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "agent" => Ok(GeneratedField::Agent),
                            "escrow_id" => Ok(GeneratedField::EscrowId),
                            "hbd_amount" => Ok(GeneratedField::HbdAmount),
                            "hive_amount" => Ok(GeneratedField::HiveAmount),
                            "fee" => Ok(GeneratedField::Fee),
                            "ratification_deadline" => Ok(GeneratedField::RatificationDeadline),
                            "escrow_expiration" => Ok(GeneratedField::EscrowExpiration),
                            "json_meta" => Ok(GeneratedField::JsonMeta),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = EscrowTransfer;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.escrow_transfer")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<EscrowTransfer, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut agent__ = None;
                let mut escrow_id__ = None;
                let mut hbd_amount__ = None;
                let mut hive_amount__ = None;
                let mut fee__ = None;
                let mut ratification_deadline__ = None;
                let mut escrow_expiration__ = None;
                let mut json_meta__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Agent => {
                            if agent__.is_some() {
                                return Err(serde::de::Error::duplicate_field("agent"));
                            }
                            agent__ = Some(map_.next_value()?);
                        }
                        GeneratedField::EscrowId => {
                            if escrow_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_id"));
                            }
                            escrow_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::HbdAmount => {
                            if hbd_amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_amount"));
                            }
                            hbd_amount__ = map_.next_value()?;
                        }
                        GeneratedField::HiveAmount => {
                            if hive_amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hive_amount"));
                            }
                            hive_amount__ = map_.next_value()?;
                        }
                        GeneratedField::Fee => {
                            if fee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fee"));
                            }
                            fee__ = map_.next_value()?;
                        }
                        GeneratedField::RatificationDeadline => {
                            if ratification_deadline__.is_some() {
                                return Err(serde::de::Error::duplicate_field("ratification_deadline"));
                            }
                            ratification_deadline__ = Some(map_.next_value()?);
                        }
                        GeneratedField::EscrowExpiration => {
                            if escrow_expiration__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_expiration"));
                            }
                            escrow_expiration__ = Some(map_.next_value()?);
                        }
                        GeneratedField::JsonMeta => {
                            if json_meta__.is_some() {
                                return Err(serde::de::Error::duplicate_field("json_meta"));
                            }
                            json_meta__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(EscrowTransfer {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    agent: agent__.ok_or_else(|| serde::de::Error::missing_field("agent"))?,
                    escrow_id: escrow_id__.ok_or_else(|| serde::de::Error::missing_field("escrow_id"))?,
                    hbd_amount: hbd_amount__.ok_or_else(|| serde::de::Error::missing_field("hbd_amount"))?,
                    hive_amount: hive_amount__.ok_or_else(|| serde::de::Error::missing_field("hive_amount"))?,
                    fee: fee__.ok_or_else(|| serde::de::Error::missing_field("fee"))?,
                    ratification_deadline: ratification_deadline__.ok_or_else(|| serde::de::Error::missing_field("ratification_deadline"))?,
                    escrow_expiration: escrow_expiration__.ok_or_else(|| serde::de::Error::missing_field("escrow_expiration"))?,
                    json_meta: json_meta__.ok_or_else(|| serde::de::Error::missing_field("json_meta"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.escrow_transfer", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ExpiredAccountNotification {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 1;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.expired_account_notification", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ExpiredAccountNotification {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ExpiredAccountNotification;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.expired_account_notification")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ExpiredAccountNotification, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(ExpiredAccountNotification {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.expired_account_notification", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for FailedRecurrentTransfer {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 7;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.failed_recurrent_transfer", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.serialize_field("memo", &self.memo)?;
        struct_ser.serialize_field("consecutive_failures", &self.consecutive_failures)?;
        struct_ser.serialize_field("remaining_executions", &self.remaining_executions)?;
        struct_ser.serialize_field("deleted", &self.deleted)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for FailedRecurrentTransfer {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "amount",
            "memo",
            "consecutive_failures",
            "remaining_executions",
            "deleted",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Amount,
            Memo,
            ConsecutiveFailures,
            RemainingExecutions,
            Deleted,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "amount" => Ok(GeneratedField::Amount),
                            "memo" => Ok(GeneratedField::Memo),
                            "consecutive_failures" => Ok(GeneratedField::ConsecutiveFailures),
                            "remaining_executions" => Ok(GeneratedField::RemainingExecutions),
                            "deleted" => Ok(GeneratedField::Deleted),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = FailedRecurrentTransfer;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.failed_recurrent_transfer")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<FailedRecurrentTransfer, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut amount__ = None;
                let mut memo__ = None;
                let mut consecutive_failures__ = None;
                let mut remaining_executions__ = None;
                let mut deleted__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                        GeneratedField::Memo => {
                            if memo__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo"));
                            }
                            memo__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ConsecutiveFailures => {
                            if consecutive_failures__.is_some() {
                                return Err(serde::de::Error::duplicate_field("consecutive_failures"));
                            }
                            consecutive_failures__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::RemainingExecutions => {
                            if remaining_executions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("remaining_executions"));
                            }
                            remaining_executions__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Deleted => {
                            if deleted__.is_some() {
                                return Err(serde::de::Error::duplicate_field("deleted"));
                            }
                            deleted__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(FailedRecurrentTransfer {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                    memo: memo__.ok_or_else(|| serde::de::Error::missing_field("memo"))?,
                    consecutive_failures: consecutive_failures__.ok_or_else(|| serde::de::Error::missing_field("consecutive_failures"))?,
                    remaining_executions: remaining_executions__.ok_or_else(|| serde::de::Error::missing_field("remaining_executions"))?,
                    deleted: deleted__.ok_or_else(|| serde::de::Error::missing_field("deleted"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.failed_recurrent_transfer", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for FeedPublish {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.feed_publish", len)?;
        struct_ser.serialize_field("publisher", &self.publisher)?;
        struct_ser.serialize_field("exchange_rate", &self.exchange_rate)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for FeedPublish {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "publisher",
            "exchange_rate",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Publisher,
            ExchangeRate,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "publisher" => Ok(GeneratedField::Publisher),
                            "exchange_rate" => Ok(GeneratedField::ExchangeRate),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = FeedPublish;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.feed_publish")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<FeedPublish, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut publisher__ = None;
                let mut exchange_rate__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Publisher => {
                            if publisher__.is_some() {
                                return Err(serde::de::Error::duplicate_field("publisher"));
                            }
                            publisher__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ExchangeRate => {
                            if exchange_rate__.is_some() {
                                return Err(serde::de::Error::duplicate_field("exchange_rate"));
                            }
                            exchange_rate__ = map_.next_value()?;
                        }
                    }
                }
                Ok(FeedPublish {
                    publisher: publisher__.ok_or_else(|| serde::de::Error::missing_field("publisher"))?,
                    exchange_rate: exchange_rate__.ok_or_else(|| serde::de::Error::missing_field("exchange_rate"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.feed_publish", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for FillCollateralizedConvertRequest {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 5;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.fill_collateralized_convert_request", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("requestid", &self.requestid)?;
        struct_ser.serialize_field("amount_in", &self.amount_in)?;
        struct_ser.serialize_field("amount_out", &self.amount_out)?;
        struct_ser.serialize_field("excess_collateral", &self.excess_collateral)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for FillCollateralizedConvertRequest {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "requestid",
            "amount_in",
            "amount_out",
            "excess_collateral",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Requestid,
            AmountIn,
            AmountOut,
            ExcessCollateral,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "requestid" => Ok(GeneratedField::Requestid),
                            "amount_in" => Ok(GeneratedField::AmountIn),
                            "amount_out" => Ok(GeneratedField::AmountOut),
                            "excess_collateral" => Ok(GeneratedField::ExcessCollateral),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = FillCollateralizedConvertRequest;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.fill_collateralized_convert_request")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<FillCollateralizedConvertRequest, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut requestid__ = None;
                let mut amount_in__ = None;
                let mut amount_out__ = None;
                let mut excess_collateral__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Requestid => {
                            if requestid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("requestid"));
                            }
                            requestid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::AmountIn => {
                            if amount_in__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount_in"));
                            }
                            amount_in__ = map_.next_value()?;
                        }
                        GeneratedField::AmountOut => {
                            if amount_out__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount_out"));
                            }
                            amount_out__ = map_.next_value()?;
                        }
                        GeneratedField::ExcessCollateral => {
                            if excess_collateral__.is_some() {
                                return Err(serde::de::Error::duplicate_field("excess_collateral"));
                            }
                            excess_collateral__ = map_.next_value()?;
                        }
                    }
                }
                Ok(FillCollateralizedConvertRequest {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    requestid: requestid__.ok_or_else(|| serde::de::Error::missing_field("requestid"))?,
                    amount_in: amount_in__.ok_or_else(|| serde::de::Error::missing_field("amount_in"))?,
                    amount_out: amount_out__.ok_or_else(|| serde::de::Error::missing_field("amount_out"))?,
                    excess_collateral: excess_collateral__.ok_or_else(|| serde::de::Error::missing_field("excess_collateral"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.fill_collateralized_convert_request", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for FillConvertRequest {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.fill_convert_request", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("requestid", &self.requestid)?;
        struct_ser.serialize_field("amount_in", &self.amount_in)?;
        struct_ser.serialize_field("amount_out", &self.amount_out)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for FillConvertRequest {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "requestid",
            "amount_in",
            "amount_out",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Requestid,
            AmountIn,
            AmountOut,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "requestid" => Ok(GeneratedField::Requestid),
                            "amount_in" => Ok(GeneratedField::AmountIn),
                            "amount_out" => Ok(GeneratedField::AmountOut),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = FillConvertRequest;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.fill_convert_request")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<FillConvertRequest, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut requestid__ = None;
                let mut amount_in__ = None;
                let mut amount_out__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Requestid => {
                            if requestid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("requestid"));
                            }
                            requestid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::AmountIn => {
                            if amount_in__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount_in"));
                            }
                            amount_in__ = map_.next_value()?;
                        }
                        GeneratedField::AmountOut => {
                            if amount_out__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount_out"));
                            }
                            amount_out__ = map_.next_value()?;
                        }
                    }
                }
                Ok(FillConvertRequest {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    requestid: requestid__.ok_or_else(|| serde::de::Error::missing_field("requestid"))?,
                    amount_in: amount_in__.ok_or_else(|| serde::de::Error::missing_field("amount_in"))?,
                    amount_out: amount_out__.ok_or_else(|| serde::de::Error::missing_field("amount_out"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.fill_convert_request", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for FillOrder {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 6;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.fill_order", len)?;
        struct_ser.serialize_field("current_owner", &self.current_owner)?;
        struct_ser.serialize_field("current_orderid", &self.current_orderid)?;
        struct_ser.serialize_field("current_pays", &self.current_pays)?;
        struct_ser.serialize_field("open_owner", &self.open_owner)?;
        struct_ser.serialize_field("open_orderid", &self.open_orderid)?;
        struct_ser.serialize_field("open_pays", &self.open_pays)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for FillOrder {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "current_owner",
            "current_orderid",
            "current_pays",
            "open_owner",
            "open_orderid",
            "open_pays",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            CurrentOwner,
            CurrentOrderid,
            CurrentPays,
            OpenOwner,
            OpenOrderid,
            OpenPays,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "current_owner" => Ok(GeneratedField::CurrentOwner),
                            "current_orderid" => Ok(GeneratedField::CurrentOrderid),
                            "current_pays" => Ok(GeneratedField::CurrentPays),
                            "open_owner" => Ok(GeneratedField::OpenOwner),
                            "open_orderid" => Ok(GeneratedField::OpenOrderid),
                            "open_pays" => Ok(GeneratedField::OpenPays),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = FillOrder;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.fill_order")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<FillOrder, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut current_owner__ = None;
                let mut current_orderid__ = None;
                let mut current_pays__ = None;
                let mut open_owner__ = None;
                let mut open_orderid__ = None;
                let mut open_pays__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::CurrentOwner => {
                            if current_owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("current_owner"));
                            }
                            current_owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::CurrentOrderid => {
                            if current_orderid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("current_orderid"));
                            }
                            current_orderid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::CurrentPays => {
                            if current_pays__.is_some() {
                                return Err(serde::de::Error::duplicate_field("current_pays"));
                            }
                            current_pays__ = map_.next_value()?;
                        }
                        GeneratedField::OpenOwner => {
                            if open_owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("open_owner"));
                            }
                            open_owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::OpenOrderid => {
                            if open_orderid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("open_orderid"));
                            }
                            open_orderid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::OpenPays => {
                            if open_pays__.is_some() {
                                return Err(serde::de::Error::duplicate_field("open_pays"));
                            }
                            open_pays__ = map_.next_value()?;
                        }
                    }
                }
                Ok(FillOrder {
                    current_owner: current_owner__.ok_or_else(|| serde::de::Error::missing_field("current_owner"))?,
                    current_orderid: current_orderid__.ok_or_else(|| serde::de::Error::missing_field("current_orderid"))?,
                    current_pays: current_pays__.ok_or_else(|| serde::de::Error::missing_field("current_pays"))?,
                    open_owner: open_owner__.ok_or_else(|| serde::de::Error::missing_field("open_owner"))?,
                    open_orderid: open_orderid__.ok_or_else(|| serde::de::Error::missing_field("open_orderid"))?,
                    open_pays: open_pays__.ok_or_else(|| serde::de::Error::missing_field("open_pays"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.fill_order", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for FillRecurrentTransfer {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 5;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.fill_recurrent_transfer", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.serialize_field("memo", &self.memo)?;
        struct_ser.serialize_field("remaining_executions", &self.remaining_executions)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for FillRecurrentTransfer {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "amount",
            "memo",
            "remaining_executions",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Amount,
            Memo,
            RemainingExecutions,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "amount" => Ok(GeneratedField::Amount),
                            "memo" => Ok(GeneratedField::Memo),
                            "remaining_executions" => Ok(GeneratedField::RemainingExecutions),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = FillRecurrentTransfer;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.fill_recurrent_transfer")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<FillRecurrentTransfer, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut amount__ = None;
                let mut memo__ = None;
                let mut remaining_executions__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                        GeneratedField::Memo => {
                            if memo__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo"));
                            }
                            memo__ = Some(map_.next_value()?);
                        }
                        GeneratedField::RemainingExecutions => {
                            if remaining_executions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("remaining_executions"));
                            }
                            remaining_executions__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(FillRecurrentTransfer {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                    memo: memo__.ok_or_else(|| serde::de::Error::missing_field("memo"))?,
                    remaining_executions: remaining_executions__.ok_or_else(|| serde::de::Error::missing_field("remaining_executions"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.fill_recurrent_transfer", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for FillTransferFromSavings {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 5;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.fill_transfer_from_savings", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.serialize_field("request_id", &self.request_id)?;
        struct_ser.serialize_field("memo", &self.memo)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for FillTransferFromSavings {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "amount",
            "request_id",
            "memo",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Amount,
            RequestId,
            Memo,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "amount" => Ok(GeneratedField::Amount),
                            "request_id" => Ok(GeneratedField::RequestId),
                            "memo" => Ok(GeneratedField::Memo),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = FillTransferFromSavings;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.fill_transfer_from_savings")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<FillTransferFromSavings, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut amount__ = None;
                let mut request_id__ = None;
                let mut memo__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                        GeneratedField::RequestId => {
                            if request_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("request_id"));
                            }
                            request_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Memo => {
                            if memo__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo"));
                            }
                            memo__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(FillTransferFromSavings {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                    request_id: request_id__.ok_or_else(|| serde::de::Error::missing_field("request_id"))?,
                    memo: memo__.ok_or_else(|| serde::de::Error::missing_field("memo"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.fill_transfer_from_savings", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for FillVestingWithdraw {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.fill_vesting_withdraw", len)?;
        struct_ser.serialize_field("from_account", &self.from_account)?;
        struct_ser.serialize_field("to_account", &self.to_account)?;
        struct_ser.serialize_field("withdrawn", &self.withdrawn)?;
        struct_ser.serialize_field("deposited", &self.deposited)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for FillVestingWithdraw {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "to_account",
            "withdrawn",
            "deposited",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Withdrawn,
            Deposited,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from_account" => Ok(GeneratedField::FromAccount),
                            "to_account" => Ok(GeneratedField::ToAccount),
                            "withdrawn" => Ok(GeneratedField::Withdrawn),
                            "deposited" => Ok(GeneratedField::Deposited),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = FillVestingWithdraw;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.fill_vesting_withdraw")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<FillVestingWithdraw, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut withdrawn__ = None;
                let mut deposited__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from_account"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to_account"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Withdrawn => {
                            if withdrawn__.is_some() {
                                return Err(serde::de::Error::duplicate_field("withdrawn"));
                            }
                            withdrawn__ = map_.next_value()?;
                        }
                        GeneratedField::Deposited => {
                            if deposited__.is_some() {
                                return Err(serde::de::Error::duplicate_field("deposited"));
                            }
                            deposited__ = map_.next_value()?;
                        }
                    }
                }
                Ok(FillVestingWithdraw {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from_account"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to_account"))?,
                    withdrawn: withdrawn__.ok_or_else(|| serde::de::Error::missing_field("withdrawn"))?,
                    deposited: deposited__.ok_or_else(|| serde::de::Error::missing_field("deposited"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.fill_vesting_withdraw", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for FutureExtensions {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if self.value.is_some() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.future_extensions", len)?;
        if let Some(v) = self.value.as_ref() {
            match v {
                future_extensions::Value::VoidT(v) => {
                    struct_ser.serialize_field("void_t", v)?;
                }
            }
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for FutureExtensions {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "void_t",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            VoidT,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "void_t" => Ok(GeneratedField::VoidT),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = FutureExtensions;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.future_extensions")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<FutureExtensions, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut value__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::VoidT => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("void_t"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(future_extensions::Value::VoidT)
;
                        }
                    }
                }
                Ok(FutureExtensions {
                    value: value__,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.future_extensions", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Hardfork {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 1;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.hardfork", len)?;
        struct_ser.serialize_field("hardfork_id", &self.hardfork_id)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Hardfork {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "hardfork_id",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            HardforkId,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "hardfork_id" => Ok(GeneratedField::HardforkId),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Hardfork;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.hardfork")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Hardfork, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut hardfork_id__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::HardforkId => {
                            if hardfork_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hardfork_id"));
                            }
                            hardfork_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(Hardfork {
                    hardfork_id: hardfork_id__.ok_or_else(|| serde::de::Error::missing_field("hardfork_id"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.hardfork", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for HardforkHive {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 6;
        if !self.other_affected_accounts.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.hardfork_hive", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("treasury", &self.treasury)?;
        if !self.other_affected_accounts.is_empty() {
            struct_ser.serialize_field("other_affected_accounts", &self.other_affected_accounts)?;
        }
        struct_ser.serialize_field("hbd_transferred", &self.hbd_transferred)?;
        struct_ser.serialize_field("hive_transferred", &self.hive_transferred)?;
        struct_ser.serialize_field("vests_converted", &self.vests_converted)?;
        struct_ser.serialize_field("total_hive_from_vests", &self.total_hive_from_vests)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for HardforkHive {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "treasury",
            "other_affected_accounts",
            "hbd_transferred",
            "hive_transferred",
            "vests_converted",
            "total_hive_from_vests",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            Treasury,
            OtherAffectedAccounts,
            HbdTransferred,
            HiveTransferred,
            VestsConverted,
            TotalHiveFromVests,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "treasury" => Ok(GeneratedField::Treasury),
                            "other_affected_accounts" => Ok(GeneratedField::OtherAffectedAccounts),
                            "hbd_transferred" => Ok(GeneratedField::HbdTransferred),
                            "hive_transferred" => Ok(GeneratedField::HiveTransferred),
                            "vests_converted" => Ok(GeneratedField::VestsConverted),
                            "total_hive_from_vests" => Ok(GeneratedField::TotalHiveFromVests),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = HardforkHive;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.hardfork_hive")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<HardforkHive, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut treasury__ = None;
                let mut other_affected_accounts__ = None;
                let mut hbd_transferred__ = None;
                let mut hive_transferred__ = None;
                let mut vests_converted__ = None;
                let mut total_hive_from_vests__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Treasury => {
                            if treasury__.is_some() {
                                return Err(serde::de::Error::duplicate_field("treasury"));
                            }
                            treasury__ = Some(map_.next_value()?);
                        }
                        GeneratedField::OtherAffectedAccounts => {
                            if other_affected_accounts__.is_some() {
                                return Err(serde::de::Error::duplicate_field("other_affected_accounts"));
                            }
                            other_affected_accounts__ = Some(map_.next_value()?);
                        }
                        GeneratedField::HbdTransferred => {
                            if hbd_transferred__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_transferred"));
                            }
                            hbd_transferred__ = map_.next_value()?;
                        }
                        GeneratedField::HiveTransferred => {
                            if hive_transferred__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hive_transferred"));
                            }
                            hive_transferred__ = map_.next_value()?;
                        }
                        GeneratedField::VestsConverted => {
                            if vests_converted__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vests_converted"));
                            }
                            vests_converted__ = map_.next_value()?;
                        }
                        GeneratedField::TotalHiveFromVests => {
                            if total_hive_from_vests__.is_some() {
                                return Err(serde::de::Error::duplicate_field("total_hive_from_vests"));
                            }
                            total_hive_from_vests__ = map_.next_value()?;
                        }
                    }
                }
                Ok(HardforkHive {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    treasury: treasury__.ok_or_else(|| serde::de::Error::missing_field("treasury"))?,
                    other_affected_accounts: other_affected_accounts__.unwrap_or_default(),
                    hbd_transferred: hbd_transferred__.ok_or_else(|| serde::de::Error::missing_field("hbd_transferred"))?,
                    hive_transferred: hive_transferred__.ok_or_else(|| serde::de::Error::missing_field("hive_transferred"))?,
                    vests_converted: vests_converted__.ok_or_else(|| serde::de::Error::missing_field("vests_converted"))?,
                    total_hive_from_vests: total_hive_from_vests__.ok_or_else(|| serde::de::Error::missing_field("total_hive_from_vests"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.hardfork_hive", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for HardforkHiveRestore {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.hardfork_hive_restore", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("treasury", &self.treasury)?;
        struct_ser.serialize_field("hbd_transferred", &self.hbd_transferred)?;
        struct_ser.serialize_field("hive_transferred", &self.hive_transferred)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for HardforkHiveRestore {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "treasury",
            "hbd_transferred",
            "hive_transferred",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            Treasury,
            HbdTransferred,
            HiveTransferred,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "treasury" => Ok(GeneratedField::Treasury),
                            "hbd_transferred" => Ok(GeneratedField::HbdTransferred),
                            "hive_transferred" => Ok(GeneratedField::HiveTransferred),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = HardforkHiveRestore;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.hardfork_hive_restore")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<HardforkHiveRestore, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut treasury__ = None;
                let mut hbd_transferred__ = None;
                let mut hive_transferred__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Treasury => {
                            if treasury__.is_some() {
                                return Err(serde::de::Error::duplicate_field("treasury"));
                            }
                            treasury__ = Some(map_.next_value()?);
                        }
                        GeneratedField::HbdTransferred => {
                            if hbd_transferred__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_transferred"));
                            }
                            hbd_transferred__ = map_.next_value()?;
                        }
                        GeneratedField::HiveTransferred => {
                            if hive_transferred__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hive_transferred"));
                            }
                            hive_transferred__ = map_.next_value()?;
                        }
                    }
                }
                Ok(HardforkHiveRestore {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    treasury: treasury__.ok_or_else(|| serde::de::Error::missing_field("treasury"))?,
                    hbd_transferred: hbd_transferred__.ok_or_else(|| serde::de::Error::missing_field("hbd_transferred"))?,
                    hive_transferred: hive_transferred__.ok_or_else(|| serde::de::Error::missing_field("hive_transferred"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.hardfork_hive_restore", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for HardforkVersionVote {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.hardfork_version_vote", len)?;
        struct_ser.serialize_field("hf_version", &self.hf_version)?;
        struct_ser.serialize_field("hf_time", &self.hf_time)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for HardforkVersionVote {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "hf_version",
            "hf_time",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            HfVersion,
            HfTime,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "hf_version" => Ok(GeneratedField::HfVersion),
                            "hf_time" => Ok(GeneratedField::HfTime),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = HardforkVersionVote;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.hardfork_version_vote")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<HardforkVersionVote, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut hf_version__ = None;
                let mut hf_time__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::HfVersion => {
                            if hf_version__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hf_version"));
                            }
                            hf_version__ = Some(map_.next_value()?);
                        }
                        GeneratedField::HfTime => {
                            if hf_time__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hf_time"));
                            }
                            hf_time__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(HardforkVersionVote {
                    hf_version: hf_version__.ok_or_else(|| serde::de::Error::missing_field("hf_version"))?,
                    hf_time: hf_time__.ok_or_else(|| serde::de::Error::missing_field("hf_time"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.hardfork_version_vote", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for IneffectiveDeleteComment {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.ineffective_delete_comment", len)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for IneffectiveDeleteComment {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "author",
            "permlink",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Author,
            Permlink,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = IneffectiveDeleteComment;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.ineffective_delete_comment")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<IneffectiveDeleteComment, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut author__ = None;
                let mut permlink__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(IneffectiveDeleteComment {
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.ineffective_delete_comment", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Interest {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.interest", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("interest", &self.interest)?;
        struct_ser.serialize_field("is_saved_into_hbd_balance", &self.is_saved_into_hbd_balance)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Interest {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "interest",
            "is_saved_into_hbd_balance",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Interest,
            IsSavedIntoHbdBalance,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "interest" => Ok(GeneratedField::Interest),
                            "is_saved_into_hbd_balance" => Ok(GeneratedField::IsSavedIntoHbdBalance),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Interest;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.interest")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Interest, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut interest__ = None;
                let mut is_saved_into_hbd_balance__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Interest => {
                            if interest__.is_some() {
                                return Err(serde::de::Error::duplicate_field("interest"));
                            }
                            interest__ = map_.next_value()?;
                        }
                        GeneratedField::IsSavedIntoHbdBalance => {
                            if is_saved_into_hbd_balance__.is_some() {
                                return Err(serde::de::Error::duplicate_field("is_saved_into_hbd_balance"));
                            }
                            is_saved_into_hbd_balance__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(Interest {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    interest: interest__.ok_or_else(|| serde::de::Error::missing_field("interest"))?,
                    is_saved_into_hbd_balance: is_saved_into_hbd_balance__.ok_or_else(|| serde::de::Error::missing_field("is_saved_into_hbd_balance"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.interest", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for LegacyChainProperties {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.legacy_chain_properties", len)?;
        struct_ser.serialize_field("account_creation_fee", &self.account_creation_fee)?;
        struct_ser.serialize_field("maximum_block_size", &self.maximum_block_size)?;
        struct_ser.serialize_field("hbd_interest_rate", &self.hbd_interest_rate)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for LegacyChainProperties {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account_creation_fee",
            "maximum_block_size",
            "hbd_interest_rate",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            AccountCreationFee,
            MaximumBlockSize,
            HbdInterestRate,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account_creation_fee" => Ok(GeneratedField::AccountCreationFee),
                            "maximum_block_size" => Ok(GeneratedField::MaximumBlockSize),
                            "hbd_interest_rate" => Ok(GeneratedField::HbdInterestRate),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = LegacyChainProperties;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.legacy_chain_properties")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<LegacyChainProperties, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account_creation_fee__ = None;
                let mut maximum_block_size__ = None;
                let mut hbd_interest_rate__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::AccountCreationFee => {
                            if account_creation_fee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_creation_fee"));
                            }
                            account_creation_fee__ = map_.next_value()?;
                        }
                        GeneratedField::MaximumBlockSize => {
                            if maximum_block_size__.is_some() {
                                return Err(serde::de::Error::duplicate_field("maximum_block_size"));
                            }
                            maximum_block_size__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::HbdInterestRate => {
                            if hbd_interest_rate__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hbd_interest_rate"));
                            }
                            hbd_interest_rate__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(LegacyChainProperties {
                    account_creation_fee: account_creation_fee__.ok_or_else(|| serde::de::Error::missing_field("account_creation_fee"))?,
                    maximum_block_size: maximum_block_size__.ok_or_else(|| serde::de::Error::missing_field("maximum_block_size"))?,
                    hbd_interest_rate: hbd_interest_rate__.ok_or_else(|| serde::de::Error::missing_field("hbd_interest_rate"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.legacy_chain_properties", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for LimitOrderCancel {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.limit_order_cancel", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("orderid", &self.orderid)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for LimitOrderCancel {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "orderid",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Orderid,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "orderid" => Ok(GeneratedField::Orderid),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = LimitOrderCancel;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.limit_order_cancel")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<LimitOrderCancel, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut orderid__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Orderid => {
                            if orderid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("orderid"));
                            }
                            orderid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(LimitOrderCancel {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    orderid: orderid__.ok_or_else(|| serde::de::Error::missing_field("orderid"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.limit_order_cancel", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for LimitOrderCancelled {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.limit_order_cancelled", len)?;
        struct_ser.serialize_field("seller", &self.seller)?;
        struct_ser.serialize_field("orderid", &self.orderid)?;
        struct_ser.serialize_field("amount_back", &self.amount_back)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for LimitOrderCancelled {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "seller",
            "orderid",
            "amount_back",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Seller,
            Orderid,
            AmountBack,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "seller" => Ok(GeneratedField::Seller),
                            "orderid" => Ok(GeneratedField::Orderid),
                            "amount_back" => Ok(GeneratedField::AmountBack),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = LimitOrderCancelled;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.limit_order_cancelled")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<LimitOrderCancelled, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut seller__ = None;
                let mut orderid__ = None;
                let mut amount_back__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Seller => {
                            if seller__.is_some() {
                                return Err(serde::de::Error::duplicate_field("seller"));
                            }
                            seller__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Orderid => {
                            if orderid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("orderid"));
                            }
                            orderid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::AmountBack => {
                            if amount_back__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount_back"));
                            }
                            amount_back__ = map_.next_value()?;
                        }
                    }
                }
                Ok(LimitOrderCancelled {
                    seller: seller__.ok_or_else(|| serde::de::Error::missing_field("seller"))?,
                    orderid: orderid__.ok_or_else(|| serde::de::Error::missing_field("orderid"))?,
                    amount_back: amount_back__.ok_or_else(|| serde::de::Error::missing_field("amount_back"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.limit_order_cancelled", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for LimitOrderCreate {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 6;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.limit_order_create", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("orderid", &self.orderid)?;
        struct_ser.serialize_field("amount_to_sell", &self.amount_to_sell)?;
        struct_ser.serialize_field("min_to_receive", &self.min_to_receive)?;
        struct_ser.serialize_field("fill_or_kill", &self.fill_or_kill)?;
        struct_ser.serialize_field("expiration", &self.expiration)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for LimitOrderCreate {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "orderid",
            "amount_to_sell",
            "min_to_receive",
            "fill_or_kill",
            "expiration",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Orderid,
            AmountToSell,
            MinToReceive,
            FillOrKill,
            Expiration,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "orderid" => Ok(GeneratedField::Orderid),
                            "amount_to_sell" => Ok(GeneratedField::AmountToSell),
                            "min_to_receive" => Ok(GeneratedField::MinToReceive),
                            "fill_or_kill" => Ok(GeneratedField::FillOrKill),
                            "expiration" => Ok(GeneratedField::Expiration),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = LimitOrderCreate;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.limit_order_create")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<LimitOrderCreate, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut orderid__ = None;
                let mut amount_to_sell__ = None;
                let mut min_to_receive__ = None;
                let mut fill_or_kill__ = None;
                let mut expiration__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Orderid => {
                            if orderid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("orderid"));
                            }
                            orderid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::AmountToSell => {
                            if amount_to_sell__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount_to_sell"));
                            }
                            amount_to_sell__ = map_.next_value()?;
                        }
                        GeneratedField::MinToReceive => {
                            if min_to_receive__.is_some() {
                                return Err(serde::de::Error::duplicate_field("min_to_receive"));
                            }
                            min_to_receive__ = map_.next_value()?;
                        }
                        GeneratedField::FillOrKill => {
                            if fill_or_kill__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fill_or_kill"));
                            }
                            fill_or_kill__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Expiration => {
                            if expiration__.is_some() {
                                return Err(serde::de::Error::duplicate_field("expiration"));
                            }
                            expiration__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(LimitOrderCreate {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    orderid: orderid__.ok_or_else(|| serde::de::Error::missing_field("orderid"))?,
                    amount_to_sell: amount_to_sell__.ok_or_else(|| serde::de::Error::missing_field("amount_to_sell"))?,
                    min_to_receive: min_to_receive__.ok_or_else(|| serde::de::Error::missing_field("min_to_receive"))?,
                    fill_or_kill: fill_or_kill__.ok_or_else(|| serde::de::Error::missing_field("fill_or_kill"))?,
                    expiration: expiration__.ok_or_else(|| serde::de::Error::missing_field("expiration"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.limit_order_create", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for LimitOrderCreate2 {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 6;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.limit_order_create2", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("orderid", &self.orderid)?;
        struct_ser.serialize_field("amount_to_sell", &self.amount_to_sell)?;
        struct_ser.serialize_field("fill_or_kill", &self.fill_or_kill)?;
        struct_ser.serialize_field("exchange_rate", &self.exchange_rate)?;
        struct_ser.serialize_field("expiration", &self.expiration)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for LimitOrderCreate2 {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "orderid",
            "amount_to_sell",
            "fill_or_kill",
            "exchange_rate",
            "expiration",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Orderid,
            AmountToSell,
            FillOrKill,
            ExchangeRate,
            Expiration,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "orderid" => Ok(GeneratedField::Orderid),
                            "amount_to_sell" => Ok(GeneratedField::AmountToSell),
                            "fill_or_kill" => Ok(GeneratedField::FillOrKill),
                            "exchange_rate" => Ok(GeneratedField::ExchangeRate),
                            "expiration" => Ok(GeneratedField::Expiration),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = LimitOrderCreate2;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.limit_order_create2")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<LimitOrderCreate2, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut orderid__ = None;
                let mut amount_to_sell__ = None;
                let mut fill_or_kill__ = None;
                let mut exchange_rate__ = None;
                let mut expiration__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Orderid => {
                            if orderid__.is_some() {
                                return Err(serde::de::Error::duplicate_field("orderid"));
                            }
                            orderid__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::AmountToSell => {
                            if amount_to_sell__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount_to_sell"));
                            }
                            amount_to_sell__ = map_.next_value()?;
                        }
                        GeneratedField::FillOrKill => {
                            if fill_or_kill__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fill_or_kill"));
                            }
                            fill_or_kill__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ExchangeRate => {
                            if exchange_rate__.is_some() {
                                return Err(serde::de::Error::duplicate_field("exchange_rate"));
                            }
                            exchange_rate__ = map_.next_value()?;
                        }
                        GeneratedField::Expiration => {
                            if expiration__.is_some() {
                                return Err(serde::de::Error::duplicate_field("expiration"));
                            }
                            expiration__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(LimitOrderCreate2 {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    orderid: orderid__.ok_or_else(|| serde::de::Error::missing_field("orderid"))?,
                    amount_to_sell: amount_to_sell__.ok_or_else(|| serde::de::Error::missing_field("amount_to_sell"))?,
                    fill_or_kill: fill_or_kill__.ok_or_else(|| serde::de::Error::missing_field("fill_or_kill"))?,
                    exchange_rate: exchange_rate__.ok_or_else(|| serde::de::Error::missing_field("exchange_rate"))?,
                    expiration: expiration__.ok_or_else(|| serde::de::Error::missing_field("expiration"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.limit_order_create2", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for LiquidityReward {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.liquidity_reward", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("payout", &self.payout)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for LiquidityReward {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "payout",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Payout,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "payout" => Ok(GeneratedField::Payout),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = LiquidityReward;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.liquidity_reward")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<LiquidityReward, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut payout__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Payout => {
                            if payout__.is_some() {
                                return Err(serde::de::Error::duplicate_field("payout"));
                            }
                            payout__ = map_.next_value()?;
                        }
                    }
                }
                Ok(LiquidityReward {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    payout: payout__.ok_or_else(|| serde::de::Error::missing_field("payout"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.liquidity_reward", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Operation {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if self.value.is_some() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.operation", len)?;
        if let Some(v) = self.value.as_ref() {
            match v {
                operation::Value::VoteOperation(v) => {
                    struct_ser.serialize_field("vote_operation", v)?;
                }
                operation::Value::CommentOperation(v) => {
                    struct_ser.serialize_field("comment_operation", v)?;
                }
                operation::Value::TransferOperation(v) => {
                    struct_ser.serialize_field("transfer_operation", v)?;
                }
                operation::Value::TransferToVestingOperation(v) => {
                    struct_ser.serialize_field("transfer_to_vesting_operation", v)?;
                }
                operation::Value::WithdrawVestingOperation(v) => {
                    struct_ser.serialize_field("withdraw_vesting_operation", v)?;
                }
                operation::Value::LimitOrderCreateOperation(v) => {
                    struct_ser.serialize_field("limit_order_create_operation", v)?;
                }
                operation::Value::LimitOrderCancelOperation(v) => {
                    struct_ser.serialize_field("limit_order_cancel_operation", v)?;
                }
                operation::Value::FeedPublishOperation(v) => {
                    struct_ser.serialize_field("feed_publish_operation", v)?;
                }
                operation::Value::ConvertOperation(v) => {
                    struct_ser.serialize_field("convert_operation", v)?;
                }
                operation::Value::AccountCreateOperation(v) => {
                    struct_ser.serialize_field("account_create_operation", v)?;
                }
                operation::Value::AccountUpdateOperation(v) => {
                    struct_ser.serialize_field("account_update_operation", v)?;
                }
                operation::Value::WitnessUpdateOperation(v) => {
                    struct_ser.serialize_field("witness_update_operation", v)?;
                }
                operation::Value::AccountWitnessVoteOperation(v) => {
                    struct_ser.serialize_field("account_witness_vote_operation", v)?;
                }
                operation::Value::AccountWitnessProxyOperation(v) => {
                    struct_ser.serialize_field("account_witness_proxy_operation", v)?;
                }
                operation::Value::PowOperation(v) => {
                    struct_ser.serialize_field("pow_operation", v)?;
                }
                operation::Value::CustomOperation(v) => {
                    struct_ser.serialize_field("custom_operation", v)?;
                }
                operation::Value::WitnessBlockApproveOperation(v) => {
                    struct_ser.serialize_field("witness_block_approve_operation", v)?;
                }
                operation::Value::DeleteCommentOperation(v) => {
                    struct_ser.serialize_field("delete_comment_operation", v)?;
                }
                operation::Value::CustomJsonOperation(v) => {
                    struct_ser.serialize_field("custom_json_operation", v)?;
                }
                operation::Value::CommentOptionsOperation(v) => {
                    struct_ser.serialize_field("comment_options_operation", v)?;
                }
                operation::Value::SetWithdrawVestingRouteOperation(v) => {
                    struct_ser.serialize_field("set_withdraw_vesting_route_operation", v)?;
                }
                operation::Value::LimitOrderCreate2Operation(v) => {
                    struct_ser.serialize_field("limit_order_create2_operation", v)?;
                }
                operation::Value::ClaimAccountOperation(v) => {
                    struct_ser.serialize_field("claim_account_operation", v)?;
                }
                operation::Value::CreateClaimedAccountOperation(v) => {
                    struct_ser.serialize_field("create_claimed_account_operation", v)?;
                }
                operation::Value::RequestAccountRecoveryOperation(v) => {
                    struct_ser.serialize_field("request_account_recovery_operation", v)?;
                }
                operation::Value::RecoverAccountOperation(v) => {
                    struct_ser.serialize_field("recover_account_operation", v)?;
                }
                operation::Value::ChangeRecoveryAccountOperation(v) => {
                    struct_ser.serialize_field("change_recovery_account_operation", v)?;
                }
                operation::Value::EscrowTransferOperation(v) => {
                    struct_ser.serialize_field("escrow_transfer_operation", v)?;
                }
                operation::Value::EscrowDisputeOperation(v) => {
                    struct_ser.serialize_field("escrow_dispute_operation", v)?;
                }
                operation::Value::EscrowReleaseOperation(v) => {
                    struct_ser.serialize_field("escrow_release_operation", v)?;
                }
                operation::Value::Pow2Operation(v) => {
                    struct_ser.serialize_field("pow2_operation", v)?;
                }
                operation::Value::EscrowApproveOperation(v) => {
                    struct_ser.serialize_field("escrow_approve_operation", v)?;
                }
                operation::Value::TransferToSavingsOperation(v) => {
                    struct_ser.serialize_field("transfer_to_savings_operation", v)?;
                }
                operation::Value::TransferFromSavingsOperation(v) => {
                    struct_ser.serialize_field("transfer_from_savings_operation", v)?;
                }
                operation::Value::CancelTransferFromSavingsOperation(v) => {
                    struct_ser.serialize_field("cancel_transfer_from_savings_operation", v)?;
                }
                operation::Value::DeclineVotingRightsOperation(v) => {
                    struct_ser.serialize_field("decline_voting_rights_operation", v)?;
                }
                operation::Value::ClaimRewardBalanceOperation(v) => {
                    struct_ser.serialize_field("claim_reward_balance_operation", v)?;
                }
                operation::Value::DelegateVestingSharesOperation(v) => {
                    struct_ser.serialize_field("delegate_vesting_shares_operation", v)?;
                }
                operation::Value::AccountCreateWithDelegationOperation(v) => {
                    struct_ser.serialize_field("account_create_with_delegation_operation", v)?;
                }
                operation::Value::WitnessSetPropertiesOperation(v) => {
                    struct_ser.serialize_field("witness_set_properties_operation", v)?;
                }
                operation::Value::AccountUpdate2Operation(v) => {
                    struct_ser.serialize_field("account_update2_operation", v)?;
                }
                operation::Value::CreateProposalOperation(v) => {
                    struct_ser.serialize_field("create_proposal_operation", v)?;
                }
                operation::Value::UpdateProposalVotesOperation(v) => {
                    struct_ser.serialize_field("update_proposal_votes_operation", v)?;
                }
                operation::Value::RemoveProposalOperation(v) => {
                    struct_ser.serialize_field("remove_proposal_operation", v)?;
                }
                operation::Value::UpdateProposalOperation(v) => {
                    struct_ser.serialize_field("update_proposal_operation", v)?;
                }
                operation::Value::CollateralizedConvertOperation(v) => {
                    struct_ser.serialize_field("collateralized_convert_operation", v)?;
                }
                operation::Value::RecurrentTransferOperation(v) => {
                    struct_ser.serialize_field("recurrent_transfer_operation", v)?;
                }
                operation::Value::FillConvertRequestOperation(v) => {
                    struct_ser.serialize_field("fill_convert_request_operation", v)?;
                }
                operation::Value::AuthorRewardOperation(v) => {
                    struct_ser.serialize_field("author_reward_operation", v)?;
                }
                operation::Value::CurationRewardOperation(v) => {
                    struct_ser.serialize_field("curation_reward_operation", v)?;
                }
                operation::Value::CommentRewardOperation(v) => {
                    struct_ser.serialize_field("comment_reward_operation", v)?;
                }
                operation::Value::LiquidityRewardOperation(v) => {
                    struct_ser.serialize_field("liquidity_reward_operation", v)?;
                }
                operation::Value::InterestOperation(v) => {
                    struct_ser.serialize_field("interest_operation", v)?;
                }
                operation::Value::FillVestingWithdrawOperation(v) => {
                    struct_ser.serialize_field("fill_vesting_withdraw_operation", v)?;
                }
                operation::Value::FillOrderOperation(v) => {
                    struct_ser.serialize_field("fill_order_operation", v)?;
                }
                operation::Value::ShutdownWitnessOperation(v) => {
                    struct_ser.serialize_field("shutdown_witness_operation", v)?;
                }
                operation::Value::FillTransferFromSavingsOperation(v) => {
                    struct_ser.serialize_field("fill_transfer_from_savings_operation", v)?;
                }
                operation::Value::HardforkOperation(v) => {
                    struct_ser.serialize_field("hardfork_operation", v)?;
                }
                operation::Value::CommentPayoutUpdateOperation(v) => {
                    struct_ser.serialize_field("comment_payout_update_operation", v)?;
                }
                operation::Value::ReturnVestingDelegationOperation(v) => {
                    struct_ser.serialize_field("return_vesting_delegation_operation", v)?;
                }
                operation::Value::CommentBenefactorRewardOperation(v) => {
                    struct_ser.serialize_field("comment_benefactor_reward_operation", v)?;
                }
                operation::Value::ProducerRewardOperation(v) => {
                    struct_ser.serialize_field("producer_reward_operation", v)?;
                }
                operation::Value::ClearNullAccountBalanceOperation(v) => {
                    struct_ser.serialize_field("clear_null_account_balance_operation", v)?;
                }
                operation::Value::ProposalPayOperation(v) => {
                    struct_ser.serialize_field("proposal_pay_operation", v)?;
                }
                operation::Value::DhfFundingOperation(v) => {
                    struct_ser.serialize_field("dhf_funding_operation", v)?;
                }
                operation::Value::HardforkHiveOperation(v) => {
                    struct_ser.serialize_field("hardfork_hive_operation", v)?;
                }
                operation::Value::HardforkHiveRestoreOperation(v) => {
                    struct_ser.serialize_field("hardfork_hive_restore_operation", v)?;
                }
                operation::Value::DelayedVotingOperation(v) => {
                    struct_ser.serialize_field("delayed_voting_operation", v)?;
                }
                operation::Value::ConsolidateTreasuryBalanceOperation(v) => {
                    struct_ser.serialize_field("consolidate_treasury_balance_operation", v)?;
                }
                operation::Value::EffectiveCommentVoteOperation(v) => {
                    struct_ser.serialize_field("effective_comment_vote_operation", v)?;
                }
                operation::Value::IneffectiveDeleteCommentOperation(v) => {
                    struct_ser.serialize_field("ineffective_delete_comment_operation", v)?;
                }
                operation::Value::DhfConversionOperation(v) => {
                    struct_ser.serialize_field("dhf_conversion_operation", v)?;
                }
                operation::Value::ExpiredAccountNotificationOperation(v) => {
                    struct_ser.serialize_field("expired_account_notification_operation", v)?;
                }
                operation::Value::ChangedRecoveryAccountOperation(v) => {
                    struct_ser.serialize_field("changed_recovery_account_operation", v)?;
                }
                operation::Value::TransferToVestingCompletedOperation(v) => {
                    struct_ser.serialize_field("transfer_to_vesting_completed_operation", v)?;
                }
                operation::Value::PowRewardOperation(v) => {
                    struct_ser.serialize_field("pow_reward_operation", v)?;
                }
                operation::Value::VestingSharesSplitOperation(v) => {
                    struct_ser.serialize_field("vesting_shares_split_operation", v)?;
                }
                operation::Value::AccountCreatedOperation(v) => {
                    struct_ser.serialize_field("account_created_operation", v)?;
                }
                operation::Value::FillCollateralizedConvertRequestOperation(v) => {
                    struct_ser.serialize_field("fill_collateralized_convert_request_operation", v)?;
                }
                operation::Value::SystemWarningOperation(v) => {
                    struct_ser.serialize_field("system_warning_operation", v)?;
                }
                operation::Value::FillRecurrentTransferOperation(v) => {
                    struct_ser.serialize_field("fill_recurrent_transfer_operation", v)?;
                }
                operation::Value::FailedRecurrentTransferOperation(v) => {
                    struct_ser.serialize_field("failed_recurrent_transfer_operation", v)?;
                }
                operation::Value::LimitOrderCancelledOperation(v) => {
                    struct_ser.serialize_field("limit_order_cancelled_operation", v)?;
                }
                operation::Value::ProducerMissedOperation(v) => {
                    struct_ser.serialize_field("producer_missed_operation", v)?;
                }
                operation::Value::ProposalFeeOperation(v) => {
                    struct_ser.serialize_field("proposal_fee_operation", v)?;
                }
                operation::Value::CollateralizedConvertImmediateConversionOperation(v) => {
                    struct_ser.serialize_field("collateralized_convert_immediate_conversion_operation", v)?;
                }
                operation::Value::EscrowApprovedOperation(v) => {
                    struct_ser.serialize_field("escrow_approved_operation", v)?;
                }
                operation::Value::EscrowRejectedOperation(v) => {
                    struct_ser.serialize_field("escrow_rejected_operation", v)?;
                }
                operation::Value::ProxyClearedOperation(v) => {
                    struct_ser.serialize_field("proxy_cleared_operation", v)?;
                }
                operation::Value::DeclinedVotingRightsOperation(v) => {
                    struct_ser.serialize_field("declined_voting_rights_operation", v)?;
                }
            }
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Operation {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "vote_operation",
            "comment_operation",
            "transfer_operation",
            "transfer_to_vesting_operation",
            "withdraw_vesting_operation",
            "limit_order_create_operation",
            "limit_order_cancel_operation",
            "feed_publish_operation",
            "convert_operation",
            "account_create_operation",
            "account_update_operation",
            "witness_update_operation",
            "account_witness_vote_operation",
            "account_witness_proxy_operation",
            "pow_operation",
            "custom_operation",
            "witness_block_approve_operation",
            "delete_comment_operation",
            "custom_json_operation",
            "comment_options_operation",
            "set_withdraw_vesting_route_operation",
            "limit_order_create2_operation",
            "claim_account_operation",
            "create_claimed_account_operation",
            "request_account_recovery_operation",
            "recover_account_operation",
            "change_recovery_account_operation",
            "escrow_transfer_operation",
            "escrow_dispute_operation",
            "escrow_release_operation",
            "pow2_operation",
            "escrow_approve_operation",
            "transfer_to_savings_operation",
            "transfer_from_savings_operation",
            "cancel_transfer_from_savings_operation",
            "decline_voting_rights_operation",
            "claim_reward_balance_operation",
            "delegate_vesting_shares_operation",
            "account_create_with_delegation_operation",
            "witness_set_properties_operation",
            "account_update2_operation",
            "create_proposal_operation",
            "update_proposal_votes_operation",
            "remove_proposal_operation",
            "update_proposal_operation",
            "collateralized_convert_operation",
            "recurrent_transfer_operation",
            "fill_convert_request_operation",
            "author_reward_operation",
            "curation_reward_operation",
            "comment_reward_operation",
            "liquidity_reward_operation",
            "interest_operation",
            "fill_vesting_withdraw_operation",
            "fill_order_operation",
            "shutdown_witness_operation",
            "fill_transfer_from_savings_operation",
            "hardfork_operation",
            "comment_payout_update_operation",
            "return_vesting_delegation_operation",
            "comment_benefactor_reward_operation",
            "producer_reward_operation",
            "clear_null_account_balance_operation",
            "proposal_pay_operation",
            "dhf_funding_operation",
            "hardfork_hive_operation",
            "hardfork_hive_restore_operation",
            "delayed_voting_operation",
            "consolidate_treasury_balance_operation",
            "effective_comment_vote_operation",
            "ineffective_delete_comment_operation",
            "dhf_conversion_operation",
            "expired_account_notification_operation",
            "changed_recovery_account_operation",
            "transfer_to_vesting_completed_operation",
            "pow_reward_operation",
            "vesting_shares_split_operation",
            "account_created_operation",
            "fill_collateralized_convert_request_operation",
            "system_warning_operation",
            "fill_recurrent_transfer_operation",
            "failed_recurrent_transfer_operation",
            "limit_order_cancelled_operation",
            "producer_missed_operation",
            "proposal_fee_operation",
            "collateralized_convert_immediate_conversion_operation",
            "escrow_approved_operation",
            "escrow_rejected_operation",
            "proxy_cleared_operation",
            "declined_voting_rights_operation",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            VoteOperation,
            CommentOperation,
            TransferOperation,
            TransferToVestingOperation,
            WithdrawVestingOperation,
            LimitOrderCreateOperation,
            LimitOrderCancelOperation,
            FeedPublishOperation,
            ConvertOperation,
            AccountCreateOperation,
            AccountUpdateOperation,
            WitnessUpdateOperation,
            AccountWitnessVoteOperation,
            AccountWitnessProxyOperation,
            PowOperation,
            CustomOperation,
            WitnessBlockApproveOperation,
            DeleteCommentOperation,
            CustomJsonOperation,
            CommentOptionsOperation,
            SetWithdrawVestingRouteOperation,
            LimitOrderCreate2Operation,
            ClaimAccountOperation,
            CreateClaimedAccountOperation,
            RequestAccountRecoveryOperation,
            RecoverAccountOperation,
            ChangeRecoveryAccountOperation,
            EscrowTransferOperation,
            EscrowDisputeOperation,
            EscrowReleaseOperation,
            Pow2Operation,
            EscrowApproveOperation,
            TransferToSavingsOperation,
            TransferFromSavingsOperation,
            CancelTransferFromSavingsOperation,
            DeclineVotingRightsOperation,
            ClaimRewardBalanceOperation,
            DelegateVestingSharesOperation,
            AccountCreateWithDelegationOperation,
            WitnessSetPropertiesOperation,
            AccountUpdate2Operation,
            CreateProposalOperation,
            UpdateProposalVotesOperation,
            RemoveProposalOperation,
            UpdateProposalOperation,
            CollateralizedConvertOperation,
            RecurrentTransferOperation,
            FillConvertRequestOperation,
            AuthorRewardOperation,
            CurationRewardOperation,
            CommentRewardOperation,
            LiquidityRewardOperation,
            InterestOperation,
            FillVestingWithdrawOperation,
            FillOrderOperation,
            ShutdownWitnessOperation,
            FillTransferFromSavingsOperation,
            HardforkOperation,
            CommentPayoutUpdateOperation,
            ReturnVestingDelegationOperation,
            CommentBenefactorRewardOperation,
            ProducerRewardOperation,
            ClearNullAccountBalanceOperation,
            ProposalPayOperation,
            DhfFundingOperation,
            HardforkHiveOperation,
            HardforkHiveRestoreOperation,
            DelayedVotingOperation,
            ConsolidateTreasuryBalanceOperation,
            EffectiveCommentVoteOperation,
            IneffectiveDeleteCommentOperation,
            DhfConversionOperation,
            ExpiredAccountNotificationOperation,
            ChangedRecoveryAccountOperation,
            TransferToVestingCompletedOperation,
            PowRewardOperation,
            VestingSharesSplitOperation,
            AccountCreatedOperation,
            FillCollateralizedConvertRequestOperation,
            SystemWarningOperation,
            FillRecurrentTransferOperation,
            FailedRecurrentTransferOperation,
            LimitOrderCancelledOperation,
            ProducerMissedOperation,
            ProposalFeeOperation,
            CollateralizedConvertImmediateConversionOperation,
            EscrowApprovedOperation,
            EscrowRejectedOperation,
            ProxyClearedOperation,
            DeclinedVotingRightsOperation,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "vote_operation" => Ok(GeneratedField::VoteOperation),
                            "comment_operation" => Ok(GeneratedField::CommentOperation),
                            "transfer_operation" => Ok(GeneratedField::TransferOperation),
                            "transfer_to_vesting_operation" => Ok(GeneratedField::TransferToVestingOperation),
                            "withdraw_vesting_operation" => Ok(GeneratedField::WithdrawVestingOperation),
                            "limit_order_create_operation" => Ok(GeneratedField::LimitOrderCreateOperation),
                            "limit_order_cancel_operation" => Ok(GeneratedField::LimitOrderCancelOperation),
                            "feed_publish_operation" => Ok(GeneratedField::FeedPublishOperation),
                            "convert_operation" => Ok(GeneratedField::ConvertOperation),
                            "account_create_operation" => Ok(GeneratedField::AccountCreateOperation),
                            "account_update_operation" => Ok(GeneratedField::AccountUpdateOperation),
                            "witness_update_operation" => Ok(GeneratedField::WitnessUpdateOperation),
                            "account_witness_vote_operation" => Ok(GeneratedField::AccountWitnessVoteOperation),
                            "account_witness_proxy_operation" => Ok(GeneratedField::AccountWitnessProxyOperation),
                            "pow_operation" => Ok(GeneratedField::PowOperation),
                            "custom_operation" => Ok(GeneratedField::CustomOperation),
                            "witness_block_approve_operation" => Ok(GeneratedField::WitnessBlockApproveOperation),
                            "delete_comment_operation" => Ok(GeneratedField::DeleteCommentOperation),
                            "custom_json_operation" => Ok(GeneratedField::CustomJsonOperation),
                            "comment_options_operation" => Ok(GeneratedField::CommentOptionsOperation),
                            "set_withdraw_vesting_route_operation" => Ok(GeneratedField::SetWithdrawVestingRouteOperation),
                            "limit_order_create2_operation" => Ok(GeneratedField::LimitOrderCreate2Operation),
                            "claim_account_operation" => Ok(GeneratedField::ClaimAccountOperation),
                            "create_claimed_account_operation" => Ok(GeneratedField::CreateClaimedAccountOperation),
                            "request_account_recovery_operation" => Ok(GeneratedField::RequestAccountRecoveryOperation),
                            "recover_account_operation" => Ok(GeneratedField::RecoverAccountOperation),
                            "change_recovery_account_operation" => Ok(GeneratedField::ChangeRecoveryAccountOperation),
                            "escrow_transfer_operation" => Ok(GeneratedField::EscrowTransferOperation),
                            "escrow_dispute_operation" => Ok(GeneratedField::EscrowDisputeOperation),
                            "escrow_release_operation" => Ok(GeneratedField::EscrowReleaseOperation),
                            "pow2_operation" => Ok(GeneratedField::Pow2Operation),
                            "escrow_approve_operation" => Ok(GeneratedField::EscrowApproveOperation),
                            "transfer_to_savings_operation" => Ok(GeneratedField::TransferToSavingsOperation),
                            "transfer_from_savings_operation" => Ok(GeneratedField::TransferFromSavingsOperation),
                            "cancel_transfer_from_savings_operation" => Ok(GeneratedField::CancelTransferFromSavingsOperation),
                            "decline_voting_rights_operation" => Ok(GeneratedField::DeclineVotingRightsOperation),
                            "claim_reward_balance_operation" => Ok(GeneratedField::ClaimRewardBalanceOperation),
                            "delegate_vesting_shares_operation" => Ok(GeneratedField::DelegateVestingSharesOperation),
                            "account_create_with_delegation_operation" => Ok(GeneratedField::AccountCreateWithDelegationOperation),
                            "witness_set_properties_operation" => Ok(GeneratedField::WitnessSetPropertiesOperation),
                            "account_update2_operation" => Ok(GeneratedField::AccountUpdate2Operation),
                            "create_proposal_operation" => Ok(GeneratedField::CreateProposalOperation),
                            "update_proposal_votes_operation" => Ok(GeneratedField::UpdateProposalVotesOperation),
                            "remove_proposal_operation" => Ok(GeneratedField::RemoveProposalOperation),
                            "update_proposal_operation" => Ok(GeneratedField::UpdateProposalOperation),
                            "collateralized_convert_operation" => Ok(GeneratedField::CollateralizedConvertOperation),
                            "recurrent_transfer_operation" => Ok(GeneratedField::RecurrentTransferOperation),
                            "fill_convert_request_operation" => Ok(GeneratedField::FillConvertRequestOperation),
                            "author_reward_operation" => Ok(GeneratedField::AuthorRewardOperation),
                            "curation_reward_operation" => Ok(GeneratedField::CurationRewardOperation),
                            "comment_reward_operation" => Ok(GeneratedField::CommentRewardOperation),
                            "liquidity_reward_operation" => Ok(GeneratedField::LiquidityRewardOperation),
                            "interest_operation" => Ok(GeneratedField::InterestOperation),
                            "fill_vesting_withdraw_operation" => Ok(GeneratedField::FillVestingWithdrawOperation),
                            "fill_order_operation" => Ok(GeneratedField::FillOrderOperation),
                            "shutdown_witness_operation" => Ok(GeneratedField::ShutdownWitnessOperation),
                            "fill_transfer_from_savings_operation" => Ok(GeneratedField::FillTransferFromSavingsOperation),
                            "hardfork_operation" => Ok(GeneratedField::HardforkOperation),
                            "comment_payout_update_operation" => Ok(GeneratedField::CommentPayoutUpdateOperation),
                            "return_vesting_delegation_operation" => Ok(GeneratedField::ReturnVestingDelegationOperation),
                            "comment_benefactor_reward_operation" => Ok(GeneratedField::CommentBenefactorRewardOperation),
                            "producer_reward_operation" => Ok(GeneratedField::ProducerRewardOperation),
                            "clear_null_account_balance_operation" => Ok(GeneratedField::ClearNullAccountBalanceOperation),
                            "proposal_pay_operation" => Ok(GeneratedField::ProposalPayOperation),
                            "dhf_funding_operation" => Ok(GeneratedField::DhfFundingOperation),
                            "hardfork_hive_operation" => Ok(GeneratedField::HardforkHiveOperation),
                            "hardfork_hive_restore_operation" => Ok(GeneratedField::HardforkHiveRestoreOperation),
                            "delayed_voting_operation" => Ok(GeneratedField::DelayedVotingOperation),
                            "consolidate_treasury_balance_operation" => Ok(GeneratedField::ConsolidateTreasuryBalanceOperation),
                            "effective_comment_vote_operation" => Ok(GeneratedField::EffectiveCommentVoteOperation),
                            "ineffective_delete_comment_operation" => Ok(GeneratedField::IneffectiveDeleteCommentOperation),
                            "dhf_conversion_operation" => Ok(GeneratedField::DhfConversionOperation),
                            "expired_account_notification_operation" => Ok(GeneratedField::ExpiredAccountNotificationOperation),
                            "changed_recovery_account_operation" => Ok(GeneratedField::ChangedRecoveryAccountOperation),
                            "transfer_to_vesting_completed_operation" => Ok(GeneratedField::TransferToVestingCompletedOperation),
                            "pow_reward_operation" => Ok(GeneratedField::PowRewardOperation),
                            "vesting_shares_split_operation" => Ok(GeneratedField::VestingSharesSplitOperation),
                            "account_created_operation" => Ok(GeneratedField::AccountCreatedOperation),
                            "fill_collateralized_convert_request_operation" => Ok(GeneratedField::FillCollateralizedConvertRequestOperation),
                            "system_warning_operation" => Ok(GeneratedField::SystemWarningOperation),
                            "fill_recurrent_transfer_operation" => Ok(GeneratedField::FillRecurrentTransferOperation),
                            "failed_recurrent_transfer_operation" => Ok(GeneratedField::FailedRecurrentTransferOperation),
                            "limit_order_cancelled_operation" => Ok(GeneratedField::LimitOrderCancelledOperation),
                            "producer_missed_operation" => Ok(GeneratedField::ProducerMissedOperation),
                            "proposal_fee_operation" => Ok(GeneratedField::ProposalFeeOperation),
                            "collateralized_convert_immediate_conversion_operation" => Ok(GeneratedField::CollateralizedConvertImmediateConversionOperation),
                            "escrow_approved_operation" => Ok(GeneratedField::EscrowApprovedOperation),
                            "escrow_rejected_operation" => Ok(GeneratedField::EscrowRejectedOperation),
                            "proxy_cleared_operation" => Ok(GeneratedField::ProxyClearedOperation),
                            "declined_voting_rights_operation" => Ok(GeneratedField::DeclinedVotingRightsOperation),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Operation;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.operation")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Operation, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut value__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::VoteOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vote_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::VoteOperation)
;
                        }
                        GeneratedField::CommentOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("comment_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CommentOperation)
;
                        }
                        GeneratedField::TransferOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("transfer_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::TransferOperation)
;
                        }
                        GeneratedField::TransferToVestingOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("transfer_to_vesting_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::TransferToVestingOperation)
;
                        }
                        GeneratedField::WithdrawVestingOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("withdraw_vesting_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::WithdrawVestingOperation)
;
                        }
                        GeneratedField::LimitOrderCreateOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("limit_order_create_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::LimitOrderCreateOperation)
;
                        }
                        GeneratedField::LimitOrderCancelOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("limit_order_cancel_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::LimitOrderCancelOperation)
;
                        }
                        GeneratedField::FeedPublishOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("feed_publish_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::FeedPublishOperation)
;
                        }
                        GeneratedField::ConvertOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("convert_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ConvertOperation)
;
                        }
                        GeneratedField::AccountCreateOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_create_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::AccountCreateOperation)
;
                        }
                        GeneratedField::AccountUpdateOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_update_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::AccountUpdateOperation)
;
                        }
                        GeneratedField::WitnessUpdateOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("witness_update_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::WitnessUpdateOperation)
;
                        }
                        GeneratedField::AccountWitnessVoteOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_witness_vote_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::AccountWitnessVoteOperation)
;
                        }
                        GeneratedField::AccountWitnessProxyOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_witness_proxy_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::AccountWitnessProxyOperation)
;
                        }
                        GeneratedField::PowOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("pow_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::PowOperation)
;
                        }
                        GeneratedField::CustomOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("custom_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CustomOperation)
;
                        }
                        GeneratedField::WitnessBlockApproveOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("witness_block_approve_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::WitnessBlockApproveOperation)
;
                        }
                        GeneratedField::DeleteCommentOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("delete_comment_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::DeleteCommentOperation)
;
                        }
                        GeneratedField::CustomJsonOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("custom_json_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CustomJsonOperation)
;
                        }
                        GeneratedField::CommentOptionsOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("comment_options_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CommentOptionsOperation)
;
                        }
                        GeneratedField::SetWithdrawVestingRouteOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("set_withdraw_vesting_route_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::SetWithdrawVestingRouteOperation)
;
                        }
                        GeneratedField::LimitOrderCreate2Operation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("limit_order_create2_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::LimitOrderCreate2Operation)
;
                        }
                        GeneratedField::ClaimAccountOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("claim_account_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ClaimAccountOperation)
;
                        }
                        GeneratedField::CreateClaimedAccountOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("create_claimed_account_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CreateClaimedAccountOperation)
;
                        }
                        GeneratedField::RequestAccountRecoveryOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("request_account_recovery_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::RequestAccountRecoveryOperation)
;
                        }
                        GeneratedField::RecoverAccountOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("recover_account_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::RecoverAccountOperation)
;
                        }
                        GeneratedField::ChangeRecoveryAccountOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("change_recovery_account_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ChangeRecoveryAccountOperation)
;
                        }
                        GeneratedField::EscrowTransferOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_transfer_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::EscrowTransferOperation)
;
                        }
                        GeneratedField::EscrowDisputeOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_dispute_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::EscrowDisputeOperation)
;
                        }
                        GeneratedField::EscrowReleaseOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_release_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::EscrowReleaseOperation)
;
                        }
                        GeneratedField::Pow2Operation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("pow2_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::Pow2Operation)
;
                        }
                        GeneratedField::EscrowApproveOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_approve_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::EscrowApproveOperation)
;
                        }
                        GeneratedField::TransferToSavingsOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("transfer_to_savings_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::TransferToSavingsOperation)
;
                        }
                        GeneratedField::TransferFromSavingsOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("transfer_from_savings_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::TransferFromSavingsOperation)
;
                        }
                        GeneratedField::CancelTransferFromSavingsOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("cancel_transfer_from_savings_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CancelTransferFromSavingsOperation)
;
                        }
                        GeneratedField::DeclineVotingRightsOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("decline_voting_rights_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::DeclineVotingRightsOperation)
;
                        }
                        GeneratedField::ClaimRewardBalanceOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("claim_reward_balance_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ClaimRewardBalanceOperation)
;
                        }
                        GeneratedField::DelegateVestingSharesOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("delegate_vesting_shares_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::DelegateVestingSharesOperation)
;
                        }
                        GeneratedField::AccountCreateWithDelegationOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_create_with_delegation_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::AccountCreateWithDelegationOperation)
;
                        }
                        GeneratedField::WitnessSetPropertiesOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("witness_set_properties_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::WitnessSetPropertiesOperation)
;
                        }
                        GeneratedField::AccountUpdate2Operation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_update2_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::AccountUpdate2Operation)
;
                        }
                        GeneratedField::CreateProposalOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("create_proposal_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CreateProposalOperation)
;
                        }
                        GeneratedField::UpdateProposalVotesOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("update_proposal_votes_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::UpdateProposalVotesOperation)
;
                        }
                        GeneratedField::RemoveProposalOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("remove_proposal_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::RemoveProposalOperation)
;
                        }
                        GeneratedField::UpdateProposalOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("update_proposal_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::UpdateProposalOperation)
;
                        }
                        GeneratedField::CollateralizedConvertOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("collateralized_convert_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CollateralizedConvertOperation)
;
                        }
                        GeneratedField::RecurrentTransferOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("recurrent_transfer_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::RecurrentTransferOperation)
;
                        }
                        GeneratedField::FillConvertRequestOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fill_convert_request_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::FillConvertRequestOperation)
;
                        }
                        GeneratedField::AuthorRewardOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author_reward_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::AuthorRewardOperation)
;
                        }
                        GeneratedField::CurationRewardOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("curation_reward_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CurationRewardOperation)
;
                        }
                        GeneratedField::CommentRewardOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("comment_reward_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CommentRewardOperation)
;
                        }
                        GeneratedField::LiquidityRewardOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("liquidity_reward_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::LiquidityRewardOperation)
;
                        }
                        GeneratedField::InterestOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("interest_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::InterestOperation)
;
                        }
                        GeneratedField::FillVestingWithdrawOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fill_vesting_withdraw_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::FillVestingWithdrawOperation)
;
                        }
                        GeneratedField::FillOrderOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fill_order_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::FillOrderOperation)
;
                        }
                        GeneratedField::ShutdownWitnessOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("shutdown_witness_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ShutdownWitnessOperation)
;
                        }
                        GeneratedField::FillTransferFromSavingsOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fill_transfer_from_savings_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::FillTransferFromSavingsOperation)
;
                        }
                        GeneratedField::HardforkOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hardfork_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::HardforkOperation)
;
                        }
                        GeneratedField::CommentPayoutUpdateOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("comment_payout_update_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CommentPayoutUpdateOperation)
;
                        }
                        GeneratedField::ReturnVestingDelegationOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("return_vesting_delegation_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ReturnVestingDelegationOperation)
;
                        }
                        GeneratedField::CommentBenefactorRewardOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("comment_benefactor_reward_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CommentBenefactorRewardOperation)
;
                        }
                        GeneratedField::ProducerRewardOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("producer_reward_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ProducerRewardOperation)
;
                        }
                        GeneratedField::ClearNullAccountBalanceOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("clear_null_account_balance_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ClearNullAccountBalanceOperation)
;
                        }
                        GeneratedField::ProposalPayOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proposal_pay_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ProposalPayOperation)
;
                        }
                        GeneratedField::DhfFundingOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("dhf_funding_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::DhfFundingOperation)
;
                        }
                        GeneratedField::HardforkHiveOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hardfork_hive_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::HardforkHiveOperation)
;
                        }
                        GeneratedField::HardforkHiveRestoreOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hardfork_hive_restore_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::HardforkHiveRestoreOperation)
;
                        }
                        GeneratedField::DelayedVotingOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("delayed_voting_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::DelayedVotingOperation)
;
                        }
                        GeneratedField::ConsolidateTreasuryBalanceOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("consolidate_treasury_balance_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ConsolidateTreasuryBalanceOperation)
;
                        }
                        GeneratedField::EffectiveCommentVoteOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("effective_comment_vote_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::EffectiveCommentVoteOperation)
;
                        }
                        GeneratedField::IneffectiveDeleteCommentOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("ineffective_delete_comment_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::IneffectiveDeleteCommentOperation)
;
                        }
                        GeneratedField::DhfConversionOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("dhf_conversion_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::DhfConversionOperation)
;
                        }
                        GeneratedField::ExpiredAccountNotificationOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("expired_account_notification_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ExpiredAccountNotificationOperation)
;
                        }
                        GeneratedField::ChangedRecoveryAccountOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("changed_recovery_account_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ChangedRecoveryAccountOperation)
;
                        }
                        GeneratedField::TransferToVestingCompletedOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("transfer_to_vesting_completed_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::TransferToVestingCompletedOperation)
;
                        }
                        GeneratedField::PowRewardOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("pow_reward_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::PowRewardOperation)
;
                        }
                        GeneratedField::VestingSharesSplitOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_shares_split_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::VestingSharesSplitOperation)
;
                        }
                        GeneratedField::AccountCreatedOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_created_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::AccountCreatedOperation)
;
                        }
                        GeneratedField::FillCollateralizedConvertRequestOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fill_collateralized_convert_request_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::FillCollateralizedConvertRequestOperation)
;
                        }
                        GeneratedField::SystemWarningOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("system_warning_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::SystemWarningOperation)
;
                        }
                        GeneratedField::FillRecurrentTransferOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fill_recurrent_transfer_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::FillRecurrentTransferOperation)
;
                        }
                        GeneratedField::FailedRecurrentTransferOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("failed_recurrent_transfer_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::FailedRecurrentTransferOperation)
;
                        }
                        GeneratedField::LimitOrderCancelledOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("limit_order_cancelled_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::LimitOrderCancelledOperation)
;
                        }
                        GeneratedField::ProducerMissedOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("producer_missed_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ProducerMissedOperation)
;
                        }
                        GeneratedField::ProposalFeeOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proposal_fee_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ProposalFeeOperation)
;
                        }
                        GeneratedField::CollateralizedConvertImmediateConversionOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("collateralized_convert_immediate_conversion_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::CollateralizedConvertImmediateConversionOperation)
;
                        }
                        GeneratedField::EscrowApprovedOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_approved_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::EscrowApprovedOperation)
;
                        }
                        GeneratedField::EscrowRejectedOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("escrow_rejected_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::EscrowRejectedOperation)
;
                        }
                        GeneratedField::ProxyClearedOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proxy_cleared_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::ProxyClearedOperation)
;
                        }
                        GeneratedField::DeclinedVotingRightsOperation => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("declined_voting_rights_operation"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(operation::Value::DeclinedVotingRightsOperation)
;
                        }
                    }
                }
                Ok(Operation {
                    value: value__,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.operation", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Pow {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 5;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.pow", len)?;
        struct_ser.serialize_field("worker_account", &self.worker_account)?;
        struct_ser.serialize_field("block_id", &self.block_id)?;
        #[allow(clippy::needless_borrow)]
        #[allow(clippy::needless_borrows_for_generic_args)]
        struct_ser.serialize_field("nonce", ToString::to_string(&self.nonce).as_str())?;
        struct_ser.serialize_field("work", &self.work)?;
        struct_ser.serialize_field("props", &self.props)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Pow {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "worker_account",
            "block_id",
            "nonce",
            "work",
            "props",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            WorkerAccount,
            BlockId,
            Nonce,
            Work,
            Props,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "worker_account" => Ok(GeneratedField::WorkerAccount),
                            "block_id" => Ok(GeneratedField::BlockId),
                            "nonce" => Ok(GeneratedField::Nonce),
                            "work" => Ok(GeneratedField::Work),
                            "props" => Ok(GeneratedField::Props),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Pow;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.pow")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Pow, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut worker_account__ = None;
                let mut block_id__ = None;
                let mut nonce__ = None;
                let mut work__ = None;
                let mut props__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::WorkerAccount => {
                            if worker_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("worker_account"));
                            }
                            worker_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::BlockId => {
                            if block_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("block_id"));
                            }
                            block_id__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Nonce => {
                            if nonce__.is_some() {
                                return Err(serde::de::Error::duplicate_field("nonce"));
                            }
                            nonce__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Work => {
                            if work__.is_some() {
                                return Err(serde::de::Error::duplicate_field("work"));
                            }
                            work__ = map_.next_value()?;
                        }
                        GeneratedField::Props => {
                            if props__.is_some() {
                                return Err(serde::de::Error::duplicate_field("props"));
                            }
                            props__ = map_.next_value()?;
                        }
                    }
                }
                Ok(Pow {
                    worker_account: worker_account__.ok_or_else(|| serde::de::Error::missing_field("worker_account"))?,
                    block_id: block_id__.ok_or_else(|| serde::de::Error::missing_field("block_id"))?,
                    nonce: nonce__.ok_or_else(|| serde::de::Error::missing_field("nonce"))?,
                    work: work__.ok_or_else(|| serde::de::Error::missing_field("work"))?,
                    props: props__.ok_or_else(|| serde::de::Error::missing_field("props"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.pow", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Pow2 {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 2;
        if self.new_owner_key.is_some() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.pow2", len)?;
        struct_ser.serialize_field("work", &self.work)?;
        if let Some(v) = self.new_owner_key.as_ref() {
            struct_ser.serialize_field("new_owner_key", v)?;
        }
        struct_ser.serialize_field("props", &self.props)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Pow2 {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "work",
            "new_owner_key",
            "props",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Work,
            NewOwnerKey,
            Props,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "work" => Ok(GeneratedField::Work),
                            "new_owner_key" => Ok(GeneratedField::NewOwnerKey),
                            "props" => Ok(GeneratedField::Props),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Pow2;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.pow2")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Pow2, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut work__ = None;
                let mut new_owner_key__ = None;
                let mut props__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Work => {
                            if work__.is_some() {
                                return Err(serde::de::Error::duplicate_field("work"));
                            }
                            work__ = map_.next_value()?;
                        }
                        GeneratedField::NewOwnerKey => {
                            if new_owner_key__.is_some() {
                                return Err(serde::de::Error::duplicate_field("new_owner_key"));
                            }
                            new_owner_key__ = map_.next_value()?;
                        }
                        GeneratedField::Props => {
                            if props__.is_some() {
                                return Err(serde::de::Error::duplicate_field("props"));
                            }
                            props__ = map_.next_value()?;
                        }
                    }
                }
                Ok(Pow2 {
                    work: work__.ok_or_else(|| serde::de::Error::missing_field("work"))?,
                    new_owner_key: new_owner_key__,
                    props: props__.ok_or_else(|| serde::de::Error::missing_field("props"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.pow2", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Pow2Input {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.pow2_input", len)?;
        struct_ser.serialize_field("worker_account", &self.worker_account)?;
        struct_ser.serialize_field("prev_block", &self.prev_block)?;
        #[allow(clippy::needless_borrow)]
        #[allow(clippy::needless_borrows_for_generic_args)]
        struct_ser.serialize_field("nonce", ToString::to_string(&self.nonce).as_str())?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Pow2Input {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "worker_account",
            "prev_block",
            "nonce",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            WorkerAccount,
            PrevBlock,
            Nonce,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "worker_account" => Ok(GeneratedField::WorkerAccount),
                            "prev_block" => Ok(GeneratedField::PrevBlock),
                            "nonce" => Ok(GeneratedField::Nonce),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Pow2Input;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.pow2_input")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Pow2Input, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut worker_account__ = None;
                let mut prev_block__ = None;
                let mut nonce__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::WorkerAccount => {
                            if worker_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("worker_account"));
                            }
                            worker_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::PrevBlock => {
                            if prev_block__.is_some() {
                                return Err(serde::de::Error::duplicate_field("prev_block"));
                            }
                            prev_block__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Nonce => {
                            if nonce__.is_some() {
                                return Err(serde::de::Error::duplicate_field("nonce"));
                            }
                            nonce__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(Pow2Input {
                    worker_account: worker_account__.ok_or_else(|| serde::de::Error::missing_field("worker_account"))?,
                    prev_block: prev_block__.ok_or_else(|| serde::de::Error::missing_field("prev_block"))?,
                    nonce: nonce__.ok_or_else(|| serde::de::Error::missing_field("nonce"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.pow2_input", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Pow2Pow {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.pow2_pow", len)?;
        struct_ser.serialize_field("input", &self.input)?;
        struct_ser.serialize_field("pow_summary", &self.pow_summary)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Pow2Pow {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "input",
            "pow_summary",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Input,
            PowSummary,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "input" => Ok(GeneratedField::Input),
                            "pow_summary" => Ok(GeneratedField::PowSummary),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Pow2Pow;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.pow2_pow")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Pow2Pow, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut input__ = None;
                let mut pow_summary__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Input => {
                            if input__.is_some() {
                                return Err(serde::de::Error::duplicate_field("input"));
                            }
                            input__ = map_.next_value()?;
                        }
                        GeneratedField::PowSummary => {
                            if pow_summary__.is_some() {
                                return Err(serde::de::Error::duplicate_field("pow_summary"));
                            }
                            pow_summary__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(Pow2Pow {
                    input: input__.ok_or_else(|| serde::de::Error::missing_field("input"))?,
                    pow_summary: pow_summary__.ok_or_else(|| serde::de::Error::missing_field("pow_summary"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.pow2_pow", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Pow2Work {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if self.value.is_some() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.pow2_work", len)?;
        if let Some(v) = self.value.as_ref() {
            match v {
                pow2_work::Value::Pow2(v) => {
                    struct_ser.serialize_field("pow2", v)?;
                }
                pow2_work::Value::EquihashPow(v) => {
                    struct_ser.serialize_field("equihash_pow", v)?;
                }
            }
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Pow2Work {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "pow2",
            "equihash_pow",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Pow2,
            EquihashPow,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "pow2" => Ok(GeneratedField::Pow2),
                            "equihash_pow" => Ok(GeneratedField::EquihashPow),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Pow2Work;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.pow2_work")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Pow2Work, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut value__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Pow2 => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("pow2"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(pow2_work::Value::Pow2)
;
                        }
                        GeneratedField::EquihashPow => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("equihash_pow"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(pow2_work::Value::EquihashPow)
;
                        }
                    }
                }
                Ok(Pow2Work {
                    value: value__,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.pow2_work", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for PowReward {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.pow_reward", len)?;
        struct_ser.serialize_field("worker", &self.worker)?;
        struct_ser.serialize_field("reward", &self.reward)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for PowReward {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "worker",
            "reward",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Worker,
            Reward,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "worker" => Ok(GeneratedField::Worker),
                            "reward" => Ok(GeneratedField::Reward),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = PowReward;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.pow_reward")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<PowReward, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut worker__ = None;
                let mut reward__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Worker => {
                            if worker__.is_some() {
                                return Err(serde::de::Error::duplicate_field("worker"));
                            }
                            worker__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Reward => {
                            if reward__.is_some() {
                                return Err(serde::de::Error::duplicate_field("reward"));
                            }
                            reward__ = map_.next_value()?;
                        }
                    }
                }
                Ok(PowReward {
                    worker: worker__.ok_or_else(|| serde::de::Error::missing_field("worker"))?,
                    reward: reward__.ok_or_else(|| serde::de::Error::missing_field("reward"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.pow_reward", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for PowWork {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.pow_work", len)?;
        struct_ser.serialize_field("worker", &self.worker)?;
        struct_ser.serialize_field("input", &self.input)?;
        struct_ser.serialize_field("signature", &self.signature)?;
        struct_ser.serialize_field("work", &self.work)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for PowWork {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "worker",
            "input",
            "signature",
            "work",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Worker,
            Input,
            Signature,
            Work,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "worker" => Ok(GeneratedField::Worker),
                            "input" => Ok(GeneratedField::Input),
                            "signature" => Ok(GeneratedField::Signature),
                            "work" => Ok(GeneratedField::Work),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = PowWork;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.pow_work")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<PowWork, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut worker__ = None;
                let mut input__ = None;
                let mut signature__ = None;
                let mut work__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Worker => {
                            if worker__.is_some() {
                                return Err(serde::de::Error::duplicate_field("worker"));
                            }
                            worker__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Input => {
                            if input__.is_some() {
                                return Err(serde::de::Error::duplicate_field("input"));
                            }
                            input__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Signature => {
                            if signature__.is_some() {
                                return Err(serde::de::Error::duplicate_field("signature"));
                            }
                            signature__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Work => {
                            if work__.is_some() {
                                return Err(serde::de::Error::duplicate_field("work"));
                            }
                            work__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(PowWork {
                    worker: worker__.ok_or_else(|| serde::de::Error::missing_field("worker"))?,
                    input: input__.ok_or_else(|| serde::de::Error::missing_field("input"))?,
                    signature: signature__.ok_or_else(|| serde::de::Error::missing_field("signature"))?,
                    work: work__.ok_or_else(|| serde::de::Error::missing_field("work"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.pow_work", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Price {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.price", len)?;
        struct_ser.serialize_field("base", &self.base)?;
        struct_ser.serialize_field("quote", &self.quote)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Price {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "base",
            "quote",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Base,
            Quote,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "base" => Ok(GeneratedField::Base),
                            "quote" => Ok(GeneratedField::Quote),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Price;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.price")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Price, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut base__ = None;
                let mut quote__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Base => {
                            if base__.is_some() {
                                return Err(serde::de::Error::duplicate_field("base"));
                            }
                            base__ = map_.next_value()?;
                        }
                        GeneratedField::Quote => {
                            if quote__.is_some() {
                                return Err(serde::de::Error::duplicate_field("quote"));
                            }
                            quote__ = map_.next_value()?;
                        }
                    }
                }
                Ok(Price {
                    base: base__.ok_or_else(|| serde::de::Error::missing_field("base"))?,
                    quote: quote__.ok_or_else(|| serde::de::Error::missing_field("quote"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.price", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ProducerMissed {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 1;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.producer_missed", len)?;
        struct_ser.serialize_field("producer", &self.producer)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ProducerMissed {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "producer",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Producer,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "producer" => Ok(GeneratedField::Producer),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ProducerMissed;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.producer_missed")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ProducerMissed, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut producer__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Producer => {
                            if producer__.is_some() {
                                return Err(serde::de::Error::duplicate_field("producer"));
                            }
                            producer__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(ProducerMissed {
                    producer: producer__.ok_or_else(|| serde::de::Error::missing_field("producer"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.producer_missed", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ProducerReward {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.producer_reward", len)?;
        struct_ser.serialize_field("producer", &self.producer)?;
        struct_ser.serialize_field("vesting_shares", &self.vesting_shares)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ProducerReward {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "producer",
            "vesting_shares",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Producer,
            VestingShares,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "producer" => Ok(GeneratedField::Producer),
                            "vesting_shares" => Ok(GeneratedField::VestingShares),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ProducerReward;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.producer_reward")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ProducerReward, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut producer__ = None;
                let mut vesting_shares__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Producer => {
                            if producer__.is_some() {
                                return Err(serde::de::Error::duplicate_field("producer"));
                            }
                            producer__ = Some(map_.next_value()?);
                        }
                        GeneratedField::VestingShares => {
                            if vesting_shares__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_shares"));
                            }
                            vesting_shares__ = map_.next_value()?;
                        }
                    }
                }
                Ok(ProducerReward {
                    producer: producer__.ok_or_else(|| serde::de::Error::missing_field("producer"))?,
                    vesting_shares: vesting_shares__.ok_or_else(|| serde::de::Error::missing_field("vesting_shares"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.producer_reward", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ProposalFee {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.proposal_fee", len)?;
        struct_ser.serialize_field("creator", &self.creator)?;
        struct_ser.serialize_field("treasury", &self.treasury)?;
        struct_ser.serialize_field("proposal_id", &self.proposal_id)?;
        struct_ser.serialize_field("fee", &self.fee)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ProposalFee {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "creator",
            "treasury",
            "proposal_id",
            "fee",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Creator,
            Treasury,
            ProposalId,
            Fee,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "creator" => Ok(GeneratedField::Creator),
                            "treasury" => Ok(GeneratedField::Treasury),
                            "proposal_id" => Ok(GeneratedField::ProposalId),
                            "fee" => Ok(GeneratedField::Fee),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ProposalFee;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.proposal_fee")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ProposalFee, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut creator__ = None;
                let mut treasury__ = None;
                let mut proposal_id__ = None;
                let mut fee__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Creator => {
                            if creator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("creator"));
                            }
                            creator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Treasury => {
                            if treasury__.is_some() {
                                return Err(serde::de::Error::duplicate_field("treasury"));
                            }
                            treasury__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ProposalId => {
                            if proposal_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proposal_id"));
                            }
                            proposal_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Fee => {
                            if fee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fee"));
                            }
                            fee__ = map_.next_value()?;
                        }
                    }
                }
                Ok(ProposalFee {
                    creator: creator__.ok_or_else(|| serde::de::Error::missing_field("creator"))?,
                    treasury: treasury__.ok_or_else(|| serde::de::Error::missing_field("treasury"))?,
                    proposal_id: proposal_id__.ok_or_else(|| serde::de::Error::missing_field("proposal_id"))?,
                    fee: fee__.ok_or_else(|| serde::de::Error::missing_field("fee"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.proposal_fee", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ProposalPay {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.proposal_pay", len)?;
        struct_ser.serialize_field("proposal_id", &self.proposal_id)?;
        struct_ser.serialize_field("receiver", &self.receiver)?;
        struct_ser.serialize_field("payer", &self.payer)?;
        struct_ser.serialize_field("payment", &self.payment)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ProposalPay {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "proposal_id",
            "receiver",
            "payer",
            "payment",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            ProposalId,
            Receiver,
            Payer,
            Payment,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "proposal_id" => Ok(GeneratedField::ProposalId),
                            "receiver" => Ok(GeneratedField::Receiver),
                            "payer" => Ok(GeneratedField::Payer),
                            "payment" => Ok(GeneratedField::Payment),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ProposalPay;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.proposal_pay")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ProposalPay, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut proposal_id__ = None;
                let mut receiver__ = None;
                let mut payer__ = None;
                let mut payment__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::ProposalId => {
                            if proposal_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proposal_id"));
                            }
                            proposal_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Receiver => {
                            if receiver__.is_some() {
                                return Err(serde::de::Error::duplicate_field("receiver"));
                            }
                            receiver__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Payer => {
                            if payer__.is_some() {
                                return Err(serde::de::Error::duplicate_field("payer"));
                            }
                            payer__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Payment => {
                            if payment__.is_some() {
                                return Err(serde::de::Error::duplicate_field("payment"));
                            }
                            payment__ = map_.next_value()?;
                        }
                    }
                }
                Ok(ProposalPay {
                    proposal_id: proposal_id__.ok_or_else(|| serde::de::Error::missing_field("proposal_id"))?,
                    receiver: receiver__.ok_or_else(|| serde::de::Error::missing_field("receiver"))?,
                    payer: payer__.ok_or_else(|| serde::de::Error::missing_field("payer"))?,
                    payment: payment__.ok_or_else(|| serde::de::Error::missing_field("payment"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.proposal_pay", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ProxyCleared {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.proxy_cleared", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("proxy", &self.proxy)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ProxyCleared {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "proxy",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            Proxy,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "proxy" => Ok(GeneratedField::Proxy),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ProxyCleared;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.proxy_cleared")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ProxyCleared, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut proxy__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Proxy => {
                            if proxy__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proxy"));
                            }
                            proxy__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(ProxyCleared {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    proxy: proxy__.ok_or_else(|| serde::de::Error::missing_field("proxy"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.proxy_cleared", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for RecoverAccount {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 3;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.recover_account", len)?;
        struct_ser.serialize_field("account_to_recover", &self.account_to_recover)?;
        struct_ser.serialize_field("new_owner_authority", &self.new_owner_authority)?;
        struct_ser.serialize_field("recent_owner_authority", &self.recent_owner_authority)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for RecoverAccount {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account_to_recover",
            "new_owner_authority",
            "recent_owner_authority",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            AccountToRecover,
            NewOwnerAuthority,
            RecentOwnerAuthority,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account_to_recover" => Ok(GeneratedField::AccountToRecover),
                            "new_owner_authority" => Ok(GeneratedField::NewOwnerAuthority),
                            "recent_owner_authority" => Ok(GeneratedField::RecentOwnerAuthority),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = RecoverAccount;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.recover_account")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<RecoverAccount, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account_to_recover__ = None;
                let mut new_owner_authority__ = None;
                let mut recent_owner_authority__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::AccountToRecover => {
                            if account_to_recover__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_to_recover"));
                            }
                            account_to_recover__ = Some(map_.next_value()?);
                        }
                        GeneratedField::NewOwnerAuthority => {
                            if new_owner_authority__.is_some() {
                                return Err(serde::de::Error::duplicate_field("new_owner_authority"));
                            }
                            new_owner_authority__ = map_.next_value()?;
                        }
                        GeneratedField::RecentOwnerAuthority => {
                            if recent_owner_authority__.is_some() {
                                return Err(serde::de::Error::duplicate_field("recent_owner_authority"));
                            }
                            recent_owner_authority__ = map_.next_value()?;
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(RecoverAccount {
                    account_to_recover: account_to_recover__.ok_or_else(|| serde::de::Error::missing_field("account_to_recover"))?,
                    new_owner_authority: new_owner_authority__.ok_or_else(|| serde::de::Error::missing_field("new_owner_authority"))?,
                    recent_owner_authority: recent_owner_authority__.ok_or_else(|| serde::de::Error::missing_field("recent_owner_authority"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.recover_account", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for RecurrentTransfer {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 6;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.recurrent_transfer", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.serialize_field("memo", &self.memo)?;
        struct_ser.serialize_field("recurrence", &self.recurrence)?;
        struct_ser.serialize_field("executions", &self.executions)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for RecurrentTransfer {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "amount",
            "memo",
            "recurrence",
            "executions",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Amount,
            Memo,
            Recurrence,
            Executions,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "amount" => Ok(GeneratedField::Amount),
                            "memo" => Ok(GeneratedField::Memo),
                            "recurrence" => Ok(GeneratedField::Recurrence),
                            "executions" => Ok(GeneratedField::Executions),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = RecurrentTransfer;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.recurrent_transfer")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<RecurrentTransfer, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut amount__ = None;
                let mut memo__ = None;
                let mut recurrence__ = None;
                let mut executions__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                        GeneratedField::Memo => {
                            if memo__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo"));
                            }
                            memo__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Recurrence => {
                            if recurrence__.is_some() {
                                return Err(serde::de::Error::duplicate_field("recurrence"));
                            }
                            recurrence__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Executions => {
                            if executions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("executions"));
                            }
                            executions__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(RecurrentTransfer {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                    memo: memo__.ok_or_else(|| serde::de::Error::missing_field("memo"))?,
                    recurrence: recurrence__.ok_or_else(|| serde::de::Error::missing_field("recurrence"))?,
                    executions: executions__.ok_or_else(|| serde::de::Error::missing_field("executions"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.recurrent_transfer", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for RecurrentTransferExtension {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if self.value.is_some() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.recurrent_transfer_extension", len)?;
        if let Some(v) = self.value.as_ref() {
            match v {
                recurrent_transfer_extension::Value::VoidT(v) => {
                    struct_ser.serialize_field("void_t", v)?;
                }
                recurrent_transfer_extension::Value::RecurrentTransferPairId(v) => {
                    struct_ser.serialize_field("recurrent_transfer_pair_id", v)?;
                }
            }
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for RecurrentTransferExtension {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "void_t",
            "recurrent_transfer_pair_id",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            VoidT,
            RecurrentTransferPairId,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "void_t" => Ok(GeneratedField::VoidT),
                            "recurrent_transfer_pair_id" => Ok(GeneratedField::RecurrentTransferPairId),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = RecurrentTransferExtension;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.recurrent_transfer_extension")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<RecurrentTransferExtension, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut value__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::VoidT => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("void_t"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(recurrent_transfer_extension::Value::VoidT)
;
                        }
                        GeneratedField::RecurrentTransferPairId => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("recurrent_transfer_pair_id"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(recurrent_transfer_extension::Value::RecurrentTransferPairId)
;
                        }
                    }
                }
                Ok(RecurrentTransferExtension {
                    value: value__,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.recurrent_transfer_extension", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for RecurrentTransferPairId {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 1;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.recurrent_transfer_pair_id", len)?;
        struct_ser.serialize_field("pair_id", &self.pair_id)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for RecurrentTransferPairId {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "pair_id",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            PairId,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "pair_id" => Ok(GeneratedField::PairId),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = RecurrentTransferPairId;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.recurrent_transfer_pair_id")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<RecurrentTransferPairId, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut pair_id__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::PairId => {
                            if pair_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("pair_id"));
                            }
                            pair_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(RecurrentTransferPairId {
                    pair_id: pair_id__.ok_or_else(|| serde::de::Error::missing_field("pair_id"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.recurrent_transfer_pair_id", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for RemoveProposal {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 1;
        if !self.proposal_ids.is_empty() {
            len += 1;
        }
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.remove_proposal", len)?;
        struct_ser.serialize_field("proposal_owner", &self.proposal_owner)?;
        if !self.proposal_ids.is_empty() {
            struct_ser.serialize_field("proposal_ids", &self.proposal_ids.iter().map(ToString::to_string).collect::<Vec<_>>())?;
        }
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for RemoveProposal {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "proposal_owner",
            "proposal_ids",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            ProposalOwner,
            ProposalIds,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "proposal_owner" => Ok(GeneratedField::ProposalOwner),
                            "proposal_ids" => Ok(GeneratedField::ProposalIds),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = RemoveProposal;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.remove_proposal")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<RemoveProposal, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut proposal_owner__ = None;
                let mut proposal_ids__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::ProposalOwner => {
                            if proposal_owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proposal_owner"));
                            }
                            proposal_owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ProposalIds => {
                            if proposal_ids__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proposal_ids"));
                            }
                            proposal_ids__ = 
                                Some(map_.next_value::<Vec<::pbjson::private::NumberDeserialize<_>>>()?
                                    .into_iter().map(|x| x.0).collect())
                            ;
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(RemoveProposal {
                    proposal_owner: proposal_owner__.ok_or_else(|| serde::de::Error::missing_field("proposal_owner"))?,
                    proposal_ids: proposal_ids__.unwrap_or_default(),
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.remove_proposal", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for RequestAccountRecovery {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 3;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.request_account_recovery", len)?;
        struct_ser.serialize_field("recovery_account", &self.recovery_account)?;
        struct_ser.serialize_field("account_to_recover", &self.account_to_recover)?;
        struct_ser.serialize_field("new_owner_authority", &self.new_owner_authority)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for RequestAccountRecovery {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "recovery_account",
            "account_to_recover",
            "new_owner_authority",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            RecoveryAccount,
            AccountToRecover,
            NewOwnerAuthority,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "recovery_account" => Ok(GeneratedField::RecoveryAccount),
                            "account_to_recover" => Ok(GeneratedField::AccountToRecover),
                            "new_owner_authority" => Ok(GeneratedField::NewOwnerAuthority),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = RequestAccountRecovery;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.request_account_recovery")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<RequestAccountRecovery, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut recovery_account__ = None;
                let mut account_to_recover__ = None;
                let mut new_owner_authority__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::RecoveryAccount => {
                            if recovery_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("recovery_account"));
                            }
                            recovery_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::AccountToRecover => {
                            if account_to_recover__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account_to_recover"));
                            }
                            account_to_recover__ = Some(map_.next_value()?);
                        }
                        GeneratedField::NewOwnerAuthority => {
                            if new_owner_authority__.is_some() {
                                return Err(serde::de::Error::duplicate_field("new_owner_authority"));
                            }
                            new_owner_authority__ = map_.next_value()?;
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(RequestAccountRecovery {
                    recovery_account: recovery_account__.ok_or_else(|| serde::de::Error::missing_field("recovery_account"))?,
                    account_to_recover: account_to_recover__.ok_or_else(|| serde::de::Error::missing_field("account_to_recover"))?,
                    new_owner_authority: new_owner_authority__.ok_or_else(|| serde::de::Error::missing_field("new_owner_authority"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.request_account_recovery", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ReturnVestingDelegation {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.return_vesting_delegation", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("vesting_shares", &self.vesting_shares)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ReturnVestingDelegation {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "vesting_shares",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            VestingShares,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "vesting_shares" => Ok(GeneratedField::VestingShares),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ReturnVestingDelegation;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.return_vesting_delegation")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ReturnVestingDelegation, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut vesting_shares__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::VestingShares => {
                            if vesting_shares__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_shares"));
                            }
                            vesting_shares__ = map_.next_value()?;
                        }
                    }
                }
                Ok(ReturnVestingDelegation {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    vesting_shares: vesting_shares__.ok_or_else(|| serde::de::Error::missing_field("vesting_shares"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.return_vesting_delegation", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for SetWithdrawVestingRoute {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.set_withdraw_vesting_route", len)?;
        struct_ser.serialize_field("from_account", &self.from_account)?;
        struct_ser.serialize_field("to_account", &self.to_account)?;
        struct_ser.serialize_field("percent", &self.percent)?;
        struct_ser.serialize_field("auto_vest", &self.auto_vest)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for SetWithdrawVestingRoute {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "to_account",
            "percent",
            "auto_vest",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Percent,
            AutoVest,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from_account" => Ok(GeneratedField::FromAccount),
                            "to_account" => Ok(GeneratedField::ToAccount),
                            "percent" => Ok(GeneratedField::Percent),
                            "auto_vest" => Ok(GeneratedField::AutoVest),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = SetWithdrawVestingRoute;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.set_withdraw_vesting_route")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<SetWithdrawVestingRoute, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut percent__ = None;
                let mut auto_vest__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from_account"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to_account"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Percent => {
                            if percent__.is_some() {
                                return Err(serde::de::Error::duplicate_field("percent"));
                            }
                            percent__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::AutoVest => {
                            if auto_vest__.is_some() {
                                return Err(serde::de::Error::duplicate_field("auto_vest"));
                            }
                            auto_vest__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(SetWithdrawVestingRoute {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from_account"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to_account"))?,
                    percent: percent__.ok_or_else(|| serde::de::Error::missing_field("percent"))?,
                    auto_vest: auto_vest__.ok_or_else(|| serde::de::Error::missing_field("auto_vest"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.set_withdraw_vesting_route", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for ShutdownWitness {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 1;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.shutdown_witness", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for ShutdownWitness {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = ShutdownWitness;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.shutdown_witness")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<ShutdownWitness, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(ShutdownWitness {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.shutdown_witness", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for SystemWarning {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 1;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.system_warning", len)?;
        struct_ser.serialize_field("message", &self.message)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for SystemWarning {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "message",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Message,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "message" => Ok(GeneratedField::Message),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = SystemWarning;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.system_warning")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<SystemWarning, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut message__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Message => {
                            if message__.is_some() {
                                return Err(serde::de::Error::duplicate_field("message"));
                            }
                            message__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(SystemWarning {
                    message: message__.ok_or_else(|| serde::de::Error::missing_field("message"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.system_warning", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Transaction {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 3;
        if !self.operations.is_empty() {
            len += 1;
        }
        if !self.extensions.is_empty() {
            len += 1;
        }
        if !self.signatures.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.transaction", len)?;
        struct_ser.serialize_field("ref_block_num", &self.ref_block_num)?;
        struct_ser.serialize_field("ref_block_prefix", &self.ref_block_prefix)?;
        struct_ser.serialize_field("expiration", &self.expiration)?;
        if !self.operations.is_empty() {
            struct_ser.serialize_field("operations", &self.operations)?;
        }
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        if !self.signatures.is_empty() {
            struct_ser.serialize_field("signatures", &self.signatures)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Transaction {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "ref_block_num",
            "ref_block_prefix",
            "expiration",
            "operations",
            "extensions",
            "signatures",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            RefBlockNum,
            RefBlockPrefix,
            Expiration,
            Operations,
            Extensions,
            Signatures,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "ref_block_num" => Ok(GeneratedField::RefBlockNum),
                            "ref_block_prefix" => Ok(GeneratedField::RefBlockPrefix),
                            "expiration" => Ok(GeneratedField::Expiration),
                            "operations" => Ok(GeneratedField::Operations),
                            "extensions" => Ok(GeneratedField::Extensions),
                            "signatures" => Ok(GeneratedField::Signatures),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Transaction;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.transaction")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Transaction, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut ref_block_num__ = None;
                let mut ref_block_prefix__ = None;
                let mut expiration__ = None;
                let mut operations__ = None;
                let mut extensions__ = None;
                let mut signatures__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::RefBlockNum => {
                            if ref_block_num__.is_some() {
                                return Err(serde::de::Error::duplicate_field("ref_block_num"));
                            }
                            ref_block_num__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::RefBlockPrefix => {
                            if ref_block_prefix__.is_some() {
                                return Err(serde::de::Error::duplicate_field("ref_block_prefix"));
                            }
                            ref_block_prefix__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Expiration => {
                            if expiration__.is_some() {
                                return Err(serde::de::Error::duplicate_field("expiration"));
                            }
                            expiration__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Operations => {
                            if operations__.is_some() {
                                return Err(serde::de::Error::duplicate_field("operations"));
                            }
                            operations__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Signatures => {
                            if signatures__.is_some() {
                                return Err(serde::de::Error::duplicate_field("signatures"));
                            }
                            signatures__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(Transaction {
                    ref_block_num: ref_block_num__.ok_or_else(|| serde::de::Error::missing_field("ref_block_num"))?,
                    ref_block_prefix: ref_block_prefix__.ok_or_else(|| serde::de::Error::missing_field("ref_block_prefix"))?,
                    expiration: expiration__.ok_or_else(|| serde::de::Error::missing_field("expiration"))?,
                    operations: operations__.unwrap_or_default(),
                    extensions: extensions__.unwrap_or_default(),
                    signatures: signatures__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.transaction", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Transfer {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.transfer", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.serialize_field("memo", &self.memo)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Transfer {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "amount",
            "memo",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Amount,
            Memo,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "amount" => Ok(GeneratedField::Amount),
                            "memo" => Ok(GeneratedField::Memo),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Transfer;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.transfer")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Transfer, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut amount__ = None;
                let mut memo__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                        GeneratedField::Memo => {
                            if memo__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo"));
                            }
                            memo__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(Transfer {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                    memo: memo__.ok_or_else(|| serde::de::Error::missing_field("memo"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.transfer", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for TransferFromSavings {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 5;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.transfer_from_savings", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("request_id", &self.request_id)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.serialize_field("memo", &self.memo)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for TransferFromSavings {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "request_id",
            "to_account",
            "to",
            "amount",
            "memo",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            RequestId,
            ToAccount,
            Amount,
            Memo,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "request_id" => Ok(GeneratedField::RequestId),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "amount" => Ok(GeneratedField::Amount),
                            "memo" => Ok(GeneratedField::Memo),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = TransferFromSavings;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.transfer_from_savings")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<TransferFromSavings, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut request_id__ = None;
                let mut to_account__ = None;
                let mut amount__ = None;
                let mut memo__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::RequestId => {
                            if request_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("request_id"));
                            }
                            request_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                        GeneratedField::Memo => {
                            if memo__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo"));
                            }
                            memo__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(TransferFromSavings {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    request_id: request_id__.ok_or_else(|| serde::de::Error::missing_field("request_id"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                    memo: memo__.ok_or_else(|| serde::de::Error::missing_field("memo"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.transfer_from_savings", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for TransferToSavings {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.transfer_to_savings", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.serialize_field("memo", &self.memo)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for TransferToSavings {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "amount",
            "memo",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Amount,
            Memo,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "amount" => Ok(GeneratedField::Amount),
                            "memo" => Ok(GeneratedField::Memo),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = TransferToSavings;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.transfer_to_savings")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<TransferToSavings, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut amount__ = None;
                let mut memo__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                        GeneratedField::Memo => {
                            if memo__.is_some() {
                                return Err(serde::de::Error::duplicate_field("memo"));
                            }
                            memo__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(TransferToSavings {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                    memo: memo__.ok_or_else(|| serde::de::Error::missing_field("memo"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.transfer_to_savings", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for TransferToVesting {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.transfer_to_vesting", len)?;
        struct_ser.serialize_field("from", &self.from_account)?;
        struct_ser.serialize_field("to", &self.to_account)?;
        struct_ser.serialize_field("amount", &self.amount)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for TransferToVesting {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "from",
            "to_account",
            "to",
            "amount",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            Amount,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from" | "from_account" => Ok(GeneratedField::FromAccount),
                            "to" | "to_account" => Ok(GeneratedField::ToAccount),
                            "amount" => Ok(GeneratedField::Amount),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = TransferToVesting;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.transfer_to_vesting")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<TransferToVesting, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut amount__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Amount => {
                            if amount__.is_some() {
                                return Err(serde::de::Error::duplicate_field("amount"));
                            }
                            amount__ = map_.next_value()?;
                        }
                    }
                }
                Ok(TransferToVesting {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to"))?,
                    amount: amount__.ok_or_else(|| serde::de::Error::missing_field("amount"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.transfer_to_vesting", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for TransferToVestingCompleted {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.transfer_to_vesting_completed", len)?;
        struct_ser.serialize_field("from_account", &self.from_account)?;
        struct_ser.serialize_field("to_account", &self.to_account)?;
        struct_ser.serialize_field("hive_vested", &self.hive_vested)?;
        struct_ser.serialize_field("vesting_shares_received", &self.vesting_shares_received)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for TransferToVestingCompleted {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "from_account",
            "to_account",
            "hive_vested",
            "vesting_shares_received",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            FromAccount,
            ToAccount,
            HiveVested,
            VestingSharesReceived,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "from_account" => Ok(GeneratedField::FromAccount),
                            "to_account" => Ok(GeneratedField::ToAccount),
                            "hive_vested" => Ok(GeneratedField::HiveVested),
                            "vesting_shares_received" => Ok(GeneratedField::VestingSharesReceived),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = TransferToVestingCompleted;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.transfer_to_vesting_completed")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<TransferToVestingCompleted, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut from_account__ = None;
                let mut to_account__ = None;
                let mut hive_vested__ = None;
                let mut vesting_shares_received__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::FromAccount => {
                            if from_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("from_account"));
                            }
                            from_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ToAccount => {
                            if to_account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("to_account"));
                            }
                            to_account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::HiveVested => {
                            if hive_vested__.is_some() {
                                return Err(serde::de::Error::duplicate_field("hive_vested"));
                            }
                            hive_vested__ = map_.next_value()?;
                        }
                        GeneratedField::VestingSharesReceived => {
                            if vesting_shares_received__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_shares_received"));
                            }
                            vesting_shares_received__ = map_.next_value()?;
                        }
                    }
                }
                Ok(TransferToVestingCompleted {
                    from_account: from_account__.ok_or_else(|| serde::de::Error::missing_field("from_account"))?,
                    to_account: to_account__.ok_or_else(|| serde::de::Error::missing_field("to_account"))?,
                    hive_vested: hive_vested__.ok_or_else(|| serde::de::Error::missing_field("hive_vested"))?,
                    vesting_shares_received: vesting_shares_received__.ok_or_else(|| serde::de::Error::missing_field("vesting_shares_received"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.transfer_to_vesting_completed", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for UpdateProposal {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 5;
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.update_proposal", len)?;
        #[allow(clippy::needless_borrow)]
        #[allow(clippy::needless_borrows_for_generic_args)]
        struct_ser.serialize_field("proposal_id", ToString::to_string(&self.proposal_id).as_str())?;
        struct_ser.serialize_field("creator", &self.creator)?;
        struct_ser.serialize_field("daily_pay", &self.daily_pay)?;
        struct_ser.serialize_field("subject", &self.subject)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for UpdateProposal {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "proposal_id",
            "creator",
            "daily_pay",
            "subject",
            "permlink",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            ProposalId,
            Creator,
            DailyPay,
            Subject,
            Permlink,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "proposal_id" => Ok(GeneratedField::ProposalId),
                            "creator" => Ok(GeneratedField::Creator),
                            "daily_pay" => Ok(GeneratedField::DailyPay),
                            "subject" => Ok(GeneratedField::Subject),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = UpdateProposal;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.update_proposal")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<UpdateProposal, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut proposal_id__ = None;
                let mut creator__ = None;
                let mut daily_pay__ = None;
                let mut subject__ = None;
                let mut permlink__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::ProposalId => {
                            if proposal_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proposal_id"));
                            }
                            proposal_id__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                        GeneratedField::Creator => {
                            if creator__.is_some() {
                                return Err(serde::de::Error::duplicate_field("creator"));
                            }
                            creator__ = Some(map_.next_value()?);
                        }
                        GeneratedField::DailyPay => {
                            if daily_pay__.is_some() {
                                return Err(serde::de::Error::duplicate_field("daily_pay"));
                            }
                            daily_pay__ = map_.next_value()?;
                        }
                        GeneratedField::Subject => {
                            if subject__.is_some() {
                                return Err(serde::de::Error::duplicate_field("subject"));
                            }
                            subject__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(UpdateProposal {
                    proposal_id: proposal_id__.ok_or_else(|| serde::de::Error::missing_field("proposal_id"))?,
                    creator: creator__.ok_or_else(|| serde::de::Error::missing_field("creator"))?,
                    daily_pay: daily_pay__.ok_or_else(|| serde::de::Error::missing_field("daily_pay"))?,
                    subject: subject__.ok_or_else(|| serde::de::Error::missing_field("subject"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.update_proposal", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for UpdateProposalEndDate {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 1;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.update_proposal_end_date", len)?;
        struct_ser.serialize_field("end_date", &self.end_date)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for UpdateProposalEndDate {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "end_date",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            EndDate,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "end_date" => Ok(GeneratedField::EndDate),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = UpdateProposalEndDate;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.update_proposal_end_date")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<UpdateProposalEndDate, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut end_date__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::EndDate => {
                            if end_date__.is_some() {
                                return Err(serde::de::Error::duplicate_field("end_date"));
                            }
                            end_date__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(UpdateProposalEndDate {
                    end_date: end_date__.ok_or_else(|| serde::de::Error::missing_field("end_date"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.update_proposal_end_date", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for UpdateProposalExtension {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 0;
        if self.value.is_some() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.update_proposal_extension", len)?;
        if let Some(v) = self.value.as_ref() {
            match v {
                update_proposal_extension::Value::VoidT(v) => {
                    struct_ser.serialize_field("void_t", v)?;
                }
                update_proposal_extension::Value::UpdateProposalEndDate(v) => {
                    struct_ser.serialize_field("update_proposal_end_date", v)?;
                }
            }
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for UpdateProposalExtension {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "void_t",
            "update_proposal_end_date",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            VoidT,
            UpdateProposalEndDate,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "void_t" => Ok(GeneratedField::VoidT),
                            "update_proposal_end_date" => Ok(GeneratedField::UpdateProposalEndDate),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = UpdateProposalExtension;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.update_proposal_extension")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<UpdateProposalExtension, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut value__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::VoidT => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("void_t"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(update_proposal_extension::Value::VoidT)
;
                        }
                        GeneratedField::UpdateProposalEndDate => {
                            if value__.is_some() {
                                return Err(serde::de::Error::duplicate_field("update_proposal_end_date"));
                            }
                            value__ = map_.next_value::<::std::option::Option<_>>()?.map(update_proposal_extension::Value::UpdateProposalEndDate)
;
                        }
                    }
                }
                Ok(UpdateProposalExtension {
                    value: value__,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.update_proposal_extension", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for UpdateProposalVotes {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 2;
        if !self.proposal_ids.is_empty() {
            len += 1;
        }
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.update_proposal_votes", len)?;
        struct_ser.serialize_field("voter", &self.voter)?;
        if !self.proposal_ids.is_empty() {
            struct_ser.serialize_field("proposal_ids", &self.proposal_ids.iter().map(ToString::to_string).collect::<Vec<_>>())?;
        }
        struct_ser.serialize_field("approve", &self.approve)?;
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for UpdateProposalVotes {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "voter",
            "proposal_ids",
            "approve",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Voter,
            ProposalIds,
            Approve,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "voter" => Ok(GeneratedField::Voter),
                            "proposal_ids" => Ok(GeneratedField::ProposalIds),
                            "approve" => Ok(GeneratedField::Approve),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = UpdateProposalVotes;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.update_proposal_votes")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<UpdateProposalVotes, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut voter__ = None;
                let mut proposal_ids__ = None;
                let mut approve__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Voter => {
                            if voter__.is_some() {
                                return Err(serde::de::Error::duplicate_field("voter"));
                            }
                            voter__ = Some(map_.next_value()?);
                        }
                        GeneratedField::ProposalIds => {
                            if proposal_ids__.is_some() {
                                return Err(serde::de::Error::duplicate_field("proposal_ids"));
                            }
                            proposal_ids__ = 
                                Some(map_.next_value::<Vec<::pbjson::private::NumberDeserialize<_>>>()?
                                    .into_iter().map(|x| x.0).collect())
                            ;
                        }
                        GeneratedField::Approve => {
                            if approve__.is_some() {
                                return Err(serde::de::Error::duplicate_field("approve"));
                            }
                            approve__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(UpdateProposalVotes {
                    voter: voter__.ok_or_else(|| serde::de::Error::missing_field("voter"))?,
                    proposal_ids: proposal_ids__.unwrap_or_default(),
                    approve: approve__.ok_or_else(|| serde::de::Error::missing_field("approve"))?,
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.update_proposal_votes", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for VestingSharesSplit {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 3;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.vesting_shares_split", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("vesting_shares_before_split", &self.vesting_shares_before_split)?;
        struct_ser.serialize_field("vesting_shares_after_split", &self.vesting_shares_after_split)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for VestingSharesSplit {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "vesting_shares_before_split",
            "vesting_shares_after_split",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            VestingSharesBeforeSplit,
            VestingSharesAfterSplit,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "vesting_shares_before_split" => Ok(GeneratedField::VestingSharesBeforeSplit),
                            "vesting_shares_after_split" => Ok(GeneratedField::VestingSharesAfterSplit),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = VestingSharesSplit;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.vesting_shares_split")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<VestingSharesSplit, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut vesting_shares_before_split__ = None;
                let mut vesting_shares_after_split__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::VestingSharesBeforeSplit => {
                            if vesting_shares_before_split__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_shares_before_split"));
                            }
                            vesting_shares_before_split__ = map_.next_value()?;
                        }
                        GeneratedField::VestingSharesAfterSplit => {
                            if vesting_shares_after_split__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_shares_after_split"));
                            }
                            vesting_shares_after_split__ = map_.next_value()?;
                        }
                    }
                }
                Ok(VestingSharesSplit {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    vesting_shares_before_split: vesting_shares_before_split__.ok_or_else(|| serde::de::Error::missing_field("vesting_shares_before_split"))?,
                    vesting_shares_after_split: vesting_shares_after_split__.ok_or_else(|| serde::de::Error::missing_field("vesting_shares_after_split"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.vesting_shares_split", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for VoidT {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 0;
        let struct_ser = serializer.serialize_struct("hive.protocol.buffers.void_t", len)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for VoidT {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                            Err(serde::de::Error::unknown_field(value, FIELDS))
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = VoidT;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.void_t")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<VoidT, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                while map_.next_key::<GeneratedField>()?.is_some() {
                    let _ = map_.next_value::<serde::de::IgnoredAny>()?;
                }
                Ok(VoidT {
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.void_t", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for Vote {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 4;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.vote", len)?;
        struct_ser.serialize_field("voter", &self.voter)?;
        struct_ser.serialize_field("author", &self.author)?;
        struct_ser.serialize_field("permlink", &self.permlink)?;
        struct_ser.serialize_field("weight", &self.weight)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for Vote {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "voter",
            "author",
            "permlink",
            "weight",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Voter,
            Author,
            Permlink,
            Weight,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "voter" => Ok(GeneratedField::Voter),
                            "author" => Ok(GeneratedField::Author),
                            "permlink" => Ok(GeneratedField::Permlink),
                            "weight" => Ok(GeneratedField::Weight),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = Vote;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.vote")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<Vote, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut voter__ = None;
                let mut author__ = None;
                let mut permlink__ = None;
                let mut weight__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Voter => {
                            if voter__.is_some() {
                                return Err(serde::de::Error::duplicate_field("voter"));
                            }
                            voter__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Author => {
                            if author__.is_some() {
                                return Err(serde::de::Error::duplicate_field("author"));
                            }
                            author__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Permlink => {
                            if permlink__.is_some() {
                                return Err(serde::de::Error::duplicate_field("permlink"));
                            }
                            permlink__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Weight => {
                            if weight__.is_some() {
                                return Err(serde::de::Error::duplicate_field("weight"));
                            }
                            weight__ = 
                                Some(map_.next_value::<::pbjson::private::NumberDeserialize<_>>()?.0)
                            ;
                        }
                    }
                }
                Ok(Vote {
                    voter: voter__.ok_or_else(|| serde::de::Error::missing_field("voter"))?,
                    author: author__.ok_or_else(|| serde::de::Error::missing_field("author"))?,
                    permlink: permlink__.ok_or_else(|| serde::de::Error::missing_field("permlink"))?,
                    weight: weight__.ok_or_else(|| serde::de::Error::missing_field("weight"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.vote", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for WithdrawVesting {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.withdraw_vesting", len)?;
        struct_ser.serialize_field("account", &self.account)?;
        struct_ser.serialize_field("vesting_shares", &self.vesting_shares)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for WithdrawVesting {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "account",
            "vesting_shares",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Account,
            VestingShares,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "account" => Ok(GeneratedField::Account),
                            "vesting_shares" => Ok(GeneratedField::VestingShares),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = WithdrawVesting;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.withdraw_vesting")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<WithdrawVesting, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut account__ = None;
                let mut vesting_shares__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Account => {
                            if account__.is_some() {
                                return Err(serde::de::Error::duplicate_field("account"));
                            }
                            account__ = Some(map_.next_value()?);
                        }
                        GeneratedField::VestingShares => {
                            if vesting_shares__.is_some() {
                                return Err(serde::de::Error::duplicate_field("vesting_shares"));
                            }
                            vesting_shares__ = map_.next_value()?;
                        }
                    }
                }
                Ok(WithdrawVesting {
                    account: account__.ok_or_else(|| serde::de::Error::missing_field("account"))?,
                    vesting_shares: vesting_shares__.ok_or_else(|| serde::de::Error::missing_field("vesting_shares"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.withdraw_vesting", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for WitnessBlockApprove {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 2;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.witness_block_approve", len)?;
        struct_ser.serialize_field("witness", &self.witness)?;
        struct_ser.serialize_field("block_id", &self.block_id)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for WitnessBlockApprove {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "witness",
            "block_id",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Witness,
            BlockId,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "witness" => Ok(GeneratedField::Witness),
                            "block_id" => Ok(GeneratedField::BlockId),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = WitnessBlockApprove;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.witness_block_approve")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<WitnessBlockApprove, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut witness__ = None;
                let mut block_id__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Witness => {
                            if witness__.is_some() {
                                return Err(serde::de::Error::duplicate_field("witness"));
                            }
                            witness__ = Some(map_.next_value()?);
                        }
                        GeneratedField::BlockId => {
                            if block_id__.is_some() {
                                return Err(serde::de::Error::duplicate_field("block_id"));
                            }
                            block_id__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(WitnessBlockApprove {
                    witness: witness__.ok_or_else(|| serde::de::Error::missing_field("witness"))?,
                    block_id: block_id__.ok_or_else(|| serde::de::Error::missing_field("block_id"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.witness_block_approve", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for WitnessSetProperties {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut len = 1;
        if !self.props.is_empty() {
            len += 1;
        }
        if !self.extensions.is_empty() {
            len += 1;
        }
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.witness_set_properties", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        if !self.props.is_empty() {
            struct_ser.serialize_field("props", &self.props)?;
        }
        if !self.extensions.is_empty() {
            struct_ser.serialize_field("extensions", &self.extensions)?;
        }
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for WitnessSetProperties {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "props",
            "extensions",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Props,
            Extensions,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "props" => Ok(GeneratedField::Props),
                            "extensions" => Ok(GeneratedField::Extensions),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = WitnessSetProperties;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.witness_set_properties")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<WitnessSetProperties, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut props__ = None;
                let mut extensions__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Props => {
                            if props__.is_some() {
                                return Err(serde::de::Error::duplicate_field("props"));
                            }
                            props__ = Some(
                                map_.next_value::<std::collections::HashMap<_, _>>()?
                            );
                        }
                        GeneratedField::Extensions => {
                            if extensions__.is_some() {
                                return Err(serde::de::Error::duplicate_field("extensions"));
                            }
                            extensions__ = Some(map_.next_value()?);
                        }
                    }
                }
                Ok(WitnessSetProperties {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    props: props__.unwrap_or_default(),
                    extensions: extensions__.unwrap_or_default(),
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.witness_set_properties", FIELDS, GeneratedVisitor)
    }
}
impl serde::Serialize for WitnessUpdate {
    #[allow(deprecated)]
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let len = 5;
        let mut struct_ser = serializer.serialize_struct("hive.protocol.buffers.witness_update", len)?;
        struct_ser.serialize_field("owner", &self.owner)?;
        struct_ser.serialize_field("url", &self.url)?;
        struct_ser.serialize_field("block_signing_key", &self.block_signing_key)?;
        struct_ser.serialize_field("props", &self.props)?;
        struct_ser.serialize_field("fee", &self.fee)?;
        struct_ser.end()
    }
}
impl<'de> serde::Deserialize<'de> for WitnessUpdate {
    #[allow(deprecated)]
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &[
            "owner",
            "url",
            "block_signing_key",
            "props",
            "fee",
        ];

        #[allow(clippy::enum_variant_names)]
        enum GeneratedField {
            Owner,
            Url,
            BlockSigningKey,
            Props,
            Fee,
        }
        impl<'de> serde::Deserialize<'de> for GeneratedField {
            fn deserialize<D>(deserializer: D) -> std::result::Result<GeneratedField, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                struct GeneratedVisitor;

                impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
                    type Value = GeneratedField;

                    fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                        write!(formatter, "expected one of: {:?}", &FIELDS)
                    }

                    #[allow(unused_variables)]
                    fn visit_str<E>(self, value: &str) -> std::result::Result<GeneratedField, E>
                    where
                        E: serde::de::Error,
                    {
                        match value {
                            "owner" => Ok(GeneratedField::Owner),
                            "url" => Ok(GeneratedField::Url),
                            "block_signing_key" => Ok(GeneratedField::BlockSigningKey),
                            "props" => Ok(GeneratedField::Props),
                            "fee" => Ok(GeneratedField::Fee),
                            _ => Err(serde::de::Error::unknown_field(value, FIELDS)),
                        }
                    }
                }
                deserializer.deserialize_identifier(GeneratedVisitor)
            }
        }
        struct GeneratedVisitor;
        impl<'de> serde::de::Visitor<'de> for GeneratedVisitor {
            type Value = WitnessUpdate;

            fn expecting(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                formatter.write_str("struct hive.protocol.buffers.witness_update")
            }

            fn visit_map<V>(self, mut map_: V) -> std::result::Result<WitnessUpdate, V::Error>
                where
                    V: serde::de::MapAccess<'de>,
            {
                let mut owner__ = None;
                let mut url__ = None;
                let mut block_signing_key__ = None;
                let mut props__ = None;
                let mut fee__ = None;
                while let Some(k) = map_.next_key()? {
                    match k {
                        GeneratedField::Owner => {
                            if owner__.is_some() {
                                return Err(serde::de::Error::duplicate_field("owner"));
                            }
                            owner__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Url => {
                            if url__.is_some() {
                                return Err(serde::de::Error::duplicate_field("url"));
                            }
                            url__ = Some(map_.next_value()?);
                        }
                        GeneratedField::BlockSigningKey => {
                            if block_signing_key__.is_some() {
                                return Err(serde::de::Error::duplicate_field("block_signing_key"));
                            }
                            block_signing_key__ = Some(map_.next_value()?);
                        }
                        GeneratedField::Props => {
                            if props__.is_some() {
                                return Err(serde::de::Error::duplicate_field("props"));
                            }
                            props__ = map_.next_value()?;
                        }
                        GeneratedField::Fee => {
                            if fee__.is_some() {
                                return Err(serde::de::Error::duplicate_field("fee"));
                            }
                            fee__ = map_.next_value()?;
                        }
                    }
                }
                Ok(WitnessUpdate {
                    owner: owner__.ok_or_else(|| serde::de::Error::missing_field("owner"))?,
                    url: url__.ok_or_else(|| serde::de::Error::missing_field("url"))?,
                    block_signing_key: block_signing_key__.ok_or_else(|| serde::de::Error::missing_field("block_signing_key"))?,
                    props: props__.ok_or_else(|| serde::de::Error::missing_field("props"))?,
                    fee: fee__.ok_or_else(|| serde::de::Error::missing_field("fee"))?,
                })
            }
        }
        deserializer.deserialize_struct("hive.protocol.buffers.witness_update", FIELDS, GeneratedVisitor)
    }
}
