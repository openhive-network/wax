use crate::options::WaxOptions;

pub trait WaxFoundation {}

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
