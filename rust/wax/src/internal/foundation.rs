use crate::foundation::WaxFoundation;
use crate::options::WaxOptions;

pub(crate) struct WaxFoundationApi {
    #[allow(dead_code)]
    options: WaxOptions,
}

impl WaxFoundationApi {
    pub(crate) fn new(options: WaxOptions) -> Self {
        Self { options }
    }
}

impl WaxFoundation for WaxFoundationApi {}
