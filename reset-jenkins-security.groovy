import jenkins.model.Jenkins
import hudson.security.HudsonPrivateSecurityRealm
import hudson.security.FullControlOnceLoggedInAuthorizationStrategy
import hudson.model.User

println 'Starting Jenkins security reset...'

Jenkins instance = Jenkins.get()
HudsonPrivateSecurityRealm realm = new HudsonPrivateSecurityRealm(false)
instance.setSecurityRealm(realm)

FullControlOnceLoggedInAuthorizationStrategy strategy = new FullControlOnceLoggedInAuthorizationStrategy()
strategy.setAllowAnonymousRead(false)
instance.setAuthorizationStrategy(strategy)

println 'Security realm and authorization strategy configured.'

User user = User.get('admin', false)
if (user == null) {
    println 'Creating admin user.'
    realm.createAccount('admin', 'admin123')
} else {
    println 'Admin user already exists. Resetting password.'
    realm.createAccount('admin', 'admin123')
}

instance.save()
println 'Jenkins security reset complete. Admin password is admin123.'
