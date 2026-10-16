import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { userService } from '../../services/api/user/userService';
import './ProfilePage.css';

function ProfilePage() {
  const {
    data: profile,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['my-profile'],
    queryFn: userService.getMyProfile,
    retry: false,
  });

  if (isPending) {
    return (
      <main className="profile-page">
        <div className="profile-state" role="status">
          Loading your profile...
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="profile-page">
        <section className="profile-state profile-error" role="alert">
          <h1>Unable to load your profile</h1>
          <p>
            {error instanceof Error
              ? error.message
              : 'Something went wrong while loading your profile.'}
          </p>
          <button type="button" onClick={() => void refetch()}>
            Try again
          </button>
        </section>
      </main>
    );
  }

  const location = [
    profile.currentCity,
    profile.currentState,
    profile.country,
  ]
    .filter(Boolean)
    .join(', ');

  const initials = profile.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <main className="profile-page">
      <header className="profile-page-header">
        <div>
          <p className="profile-eyebrow">WE ARE NAVODAYAN</p>
          <h1>My Profile</h1>
          <p className="profile-subtitle">
            Your alumni identity, experience, and interests.
          </p>
        </div>

        <Link className="profile-edit-button" to="/profile/edit">
          Edit profile
        </Link>
      </header>

      <section className="profile-hero">
        <div className="profile-avatar">
          {profile.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt={`${profile.fullName}'s profile`}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span>{initials || 'N'}</span>
          )}
        </div>

        <div className="profile-hero-details">
          <h2>{profile.fullName}</h2>
          <p className="profile-profession">
            {[profile.jobTitle, profile.organization]
              .filter(Boolean)
              .join(' at ') || profile.profession || 'Profession not added'}
          </p>
          <p className="profile-location">
            {location || 'Location not added'}
          </p>
          {profile.batchYear && (
            <span className="profile-batch-badge">
              Batch of {profile.batchYear}
            </span>
          )}
        </div>
      </section>

      <section className="profile-completeness">
        <div className="profile-section-heading">
          <div>
            <h2>Profile completeness</h2>
            <p>Keep your profile updated to help alumni connect with you.</p>
          </div>
          <strong>{profile.profileCompleteness}%</strong>
        </div>

        <div
          className="profile-progress-track"
          role="progressbar"
          aria-label="Profile completeness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={profile.profileCompleteness}
        >
          <div
            className="profile-progress-value"
            style={{
              width: `${Math.min(100, Math.max(0, profile.profileCompleteness))}%`,
            }}
          />
        </div>
      </section>

      <div className="profile-content-grid">
        <section className="profile-card">
          <h2>About me</h2>
          <p className="profile-bio">
            {profile.bio || 'Add a short introduction about yourself.'}
          </p>
        </section>

        <section className="profile-card">
          <h2>JNV & Batch</h2>
          <dl className="profile-details">
            <div>
              <dt>JNV ID</dt>
              <dd>{profile.jnvId || 'Not added'}</dd>
            </div>
            <div>
              <dt>Passing year</dt>
              <dd>{profile.batchYear ?? 'Not added'}</dd>
            </div>
          </dl>
        </section>

        <section className="profile-card">
          <h2>Professional details</h2>
          <dl className="profile-details">
            <div>
              <dt>Profession</dt>
              <dd>{profile.profession || 'Not added'}</dd>
            </div>
            <div>
              <dt>Job title</dt>
              <dd>{profile.jobTitle || 'Not added'}</dd>
            </div>
            <div>
              <dt>Organization</dt>
              <dd>{profile.organization || 'Not added'}</dd>
            </div>
          </dl>
        </section>

        <section className="profile-card">
          <h2>Location</h2>
          <dl className="profile-details">
            <div>
              <dt>City</dt>
              <dd>{profile.currentCity || 'Not added'}</dd>
            </div>
            <div>
              <dt>State</dt>
              <dd>{profile.currentState || 'Not added'}</dd>
            </div>
            <div>
              <dt>Country</dt>
              <dd>{profile.country || 'Not added'}</dd>
            </div>
          </dl>
        </section>

        <section className="profile-card">
          <h2>Skills</h2>
          {profile.skills.length > 0 ? (
            <div className="profile-tags">
              {profile.skills.map((skill) => (
                <span className="profile-tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="profile-muted">No skills added yet.</p>
          )}
        </section>

        <section className="profile-card">
          <h2>Interests</h2>
          {profile.interests.length > 0 ? (
            <div className="profile-tags">
              {profile.interests.map((interest) => (
                <span className="profile-tag" key={interest}>
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="profile-muted">No interests added yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;
