from iota.adapter.sandbox import SandboxAdapter

api = Iota(
  # To use sandbox mode, inject a ``SandboxAdapter``.
  adapter = SandboxAdapter(
    # URI of the sandbox node.
    uri = 'https://sandbox.iotatoken.com/api/v1/',

    # Access token used to authenticate requests.
    # Contact the node maintainer to get an access token.
    auth_token = 'auth token goes here',
  ),

  # Seed used for cryptographic functions.
  # If null, a random seed will be generated.
  seed = b'SEED9GOES9HERE',
)
