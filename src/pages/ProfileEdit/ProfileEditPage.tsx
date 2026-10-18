import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/user/userService';
import { jnvService } from '../../services/api/jnv/jnvService';
import type { UserProfile, UserProfileUpdateRequest } from '../../types';
import './ProfileEditPage.css';

type ProfileForm = UserProfileUpdateRequest;

function createInitialForm(profile: UserProfile): ProfileForm {
  return {
    fullName: profile.fullName,
    bio: profile.bio ?? '',
    batchYear: profile.batchYear,
    jnvId: profile.jnvId,
    profileImageUrl: profile.profileImageUrl,
    profession: profile.profession ?? '',
    organization: profile.organization ?? '',
    jobTitle: profile.jobTitle ?? '',
    currentCity: profile.currentCity ?? '',
    currentState: profile.currentState ?? '',
    country: profile.country ?? '',
  };
}

function ProfileEditForm({ profile }: { profile: UserProfile }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProfileForm>(() => createInitialForm(profile));
  const [formError, setFormError] = useState('');
  const [skills, setSkills] = useState<string[]>(profile.skills ?? []);
  const [interests, setInterests] = useState<string[]>(profile.interests ?? []);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [skillsError, setSkillsError] = useState('');
  const [interestsError, setInterestsError] = useState('');

  const [jnvSearch, setJnvSearch] = useState('');

  const {
    data: jnvs = [],
    isPending: isJnvPending,
    isError: isJnvError,
  } = useQuery({
    queryKey: ['jnvs'],
    queryFn: jnvService.getAll,
    retry: false,
  });

  const filteredJnvs = jnvs.filter((jnv) => {
    const search = jnvSearch.trim().toLowerCase();

    return (
      !search ||
      jnv.schoolName.toLowerCase().includes(search) ||
      jnv.schoolCode.toLowerCase().includes(search) ||
      jnv.district.toLowerCase().includes(search) ||
      jnv.state.toLowerCase().includes(search)
    );
  });

  const selectedJnvAvailable = jnvs.some((jnv) => jnv.id === form.jnvId);

  const mutation = useMutation({
    mutationFn: userService.updateMyProfile,
    onSuccess: async (updatedProfile) => {
      queryClient.setQueryData(['my-profile'], updatedProfile);
      await queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      navigate('/profile');
    },
    onError: (mutationError: Error) => {
      setFormError(mutationError.message || 'Unable to save your profile.');
    },
  });

  function updateField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFormError('');
  }

  const skillsMutation = useMutation({
    mutationFn: userService.replaceMySkills,
    onSuccess: async (savedSkills) => {
      setSkills(savedSkills);
      setSkillsError('');
      await queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
    onError: (error: Error) => {
      setSkillsError(error.message || 'Unable to save skills.');
    },
  });

  const interestsMutation = useMutation({
    mutationFn: userService.replaceMyInterests,
    onSuccess: async (savedInterests) => {
      setInterests(savedInterests);
      setInterestsError('');
      await queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
    onError: (error: Error) => {
      setInterestsError(error.message || 'Unable to save interests.');
    },
  });

  function addEntry(
    value: string,
    entries: string[],
    setEntries: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    label: string,
  ) {
    const entry = value.trim();

    if (!entry) {
      setError(`Enter a ${label.toLowerCase()} first.`);
      return;
    }

    if (entry.length > 100) {
      setError(`${label} must not exceed 100 characters.`);
      return;
    }

    if (entries.some((item) => item.toLowerCase() === entry.toLowerCase())) {
      setError(`This ${label.toLowerCase()} has already been added.`);
      return;
    }

    if (entries.length >= 30) {
      setError(`You can add a maximum of 30 ${label.toLowerCase()} entries.`);
      return;
    }

    setEntries([...entries, entry]);
    setInput('');
    setError('');
  }

  function removeEntry(
    value: string,
    entries: string[],
    setEntries: React.Dispatch<React.SetStateAction<string[]>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
  ) {
    setEntries(entries.filter((entry) => entry !== value));
    setError('');
  }

  function validateEntries(entries: string[], label: string): string | null {
    if (entries.length > 30) {
      return `You can add a maximum of 30 ${label.toLowerCase()} entries.`;
    }

    if (entries.some((entry) => !entry.trim() || entry.trim().length > 100)) {
      return `Each ${label.toLowerCase()} must contain 1–100 characters.`;
    }

    if (
      new Set(entries.map((entry) => entry.trim().toLowerCase())).size !==
      entries.length
    ) {
      return `Duplicate ${label.toLowerCase()} entries are not allowed.`;
    }

    return null;
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fullName = form.fullName.trim();

    if (!fullName) {
      setFormError('Full name is required.');
      return;
    }

    if (fullName.length > 150) {
      setFormError('Full name must not exceed 150 characters.');
      return;
    }

    if (form.bio && form.bio.length > 1000) {
      setFormError('Bio must not exceed 1,000 characters.');
      return;
    }

    if (
      form.batchYear !== null &&
      (!Number.isInteger(form.batchYear) || form.batchYear < 1900 || form.batchYear > 2200)
    ) {
      setFormError('Passing year must be between 1900 and 2200.');
      return;
    }

    const profileImageUrl = form.profileImageUrl?.trim() || null;

    if (profileImageUrl) {
      try {
        const imageUrl = new URL(profileImageUrl);

        if (!['http:', 'https:'].includes(imageUrl.protocol) || !imageUrl.hostname) {
          throw new Error('Invalid URL');
        }
      } catch {
        setFormError('Profile image URL must be a valid HTTP or HTTPS URL.');
        return;
      }
    }

    mutation.mutate({
      ...form,
      fullName,
      bio: form.bio?.trim() || null,
      profession: form.profession?.trim() || null,
      organization: form.organization?.trim() || null,
      jobTitle: form.jobTitle?.trim() || null,
      currentCity: form.currentCity?.trim() || null,
      currentState: form.currentState?.trim() || null,
      country: form.country?.trim() || null,
      jnvId: form.jnvId?.trim() || null,
      profileImageUrl,
    });
  }

  return (
    <main className="profile-edit-page">
      <header className="profile-edit-header">
        <div>
          <p className="profile-edit-eyebrow">WE ARE NAVODAYAN</p>
          <h1>Edit profile</h1>
          <p>Keep your alumni information up to date.</p>
        </div>
        <Link to="/profile" className="profile-edit-back">
          Cancel
        </Link>
      </header>

      <form className="profile-edit-form" onSubmit={handleSubmit} noValidate>
        <section className="profile-edit-card">
          <h2>Basic information</h2>

          <div className="profile-edit-field">
            <label htmlFor="fullName">Full name *</label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              maxLength={150}
              required
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
            />
          </div>

          <div className="profile-edit-field">
            <label htmlFor="bio">About me</label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              maxLength={1000}
              value={form.bio ?? ''}
              onChange={(event) => updateField('bio', event.target.value)}
            />
            <small>{(form.bio ?? '').length}/1000 characters</small>
          </div>
        </section>

        <section className="profile-edit-card">
          <h2>JNV &amp; batch</h2>

          <div className="profile-edit-field">
            <label htmlFor="jnvSearch">Jawahar Navodaya Vidyalaya</label>

            <input
              id="jnvSearch"
              type="search"
              value={jnvSearch}
              placeholder="Search by school, code, district or state"
              onChange={(event) => setJnvSearch(event.target.value)}
              aria-describedby="jnv-help"
            />

            <select
              id="jnvId"
              name="jnvId"
              value={form.jnvId ?? ''}
              onChange={(event) => updateField('jnvId', event.target.value || null)}
              disabled={isJnvPending || isJnvError}
            >
              <option value="">Select your JNV (optional)</option>

              {form.jnvId && !selectedJnvAvailable && (
                <option value={form.jnvId}>Previously selected JNV (unavailable)</option>
              )}

              {filteredJnvs
                .filter((jnv) => jnv.active)
                .map((jnv) => (
                  <option key={jnv.id} value={jnv.id}>
                    {jnv.schoolName} — {jnv.district}, {jnv.state} ({jnv.schoolCode})
                  </option>
                ))}
            </select>

            <small id="jnv-help">
              {isJnvPending
                ? 'Loading JNV directory...'
                : isJnvError
                  ? 'Unable to load the JNV directory. Try again later.'
                  : `${filteredJnvs.filter((jnv) => jnv.active).length} matching active JNV(s).`}
            </small>
          </div>
        </section>

        <section className="profile-edit-card">
          <h2>Professional details</h2>

          <div className="profile-edit-grid">
            <div className="profile-edit-field">
              <label htmlFor="profession">Profession</label>
              <input
                id="profession"
                maxLength={100}
                value={form.profession ?? ''}
                onChange={(event) => updateField('profession', event.target.value)}
              />
            </div>

            <div className="profile-edit-field">
              <label htmlFor="jobTitle">Job title</label>
              <input
                id="jobTitle"
                maxLength={150}
                value={form.jobTitle ?? ''}
                onChange={(event) => updateField('jobTitle', event.target.value)}
              />
            </div>

            <div className="profile-edit-field">
              <label htmlFor="organization">Organization</label>
              <input
                id="organization"
                maxLength={150}
                value={form.organization ?? ''}
                onChange={(event) => updateField('organization', event.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="profile-edit-card">
          <h2>Location</h2>

          <div className="profile-edit-grid">
            <div className="profile-edit-field">
              <label htmlFor="currentCity">City</label>
              <input
                id="currentCity"
                maxLength={100}
                autoComplete="address-level2"
                value={form.currentCity ?? ''}
                onChange={(event) => updateField('currentCity', event.target.value)}
              />
            </div>

            <div className="profile-edit-field">
              <label htmlFor="currentState">State</label>
              <input
                id="currentState"
                maxLength={100}
                autoComplete="address-level1"
                value={form.currentState ?? ''}
                onChange={(event) => updateField('currentState', event.target.value)}
              />
            </div>

            <div className="profile-edit-field">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                maxLength={100}
                autoComplete="country-name"
                value={form.country ?? ''}
                onChange={(event) => updateField('country', event.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="profile-edit-card">
          <h2>Skills</h2>
          <p>Add skills that can help fellow Navodayans discover your expertise.</p>

          <div className="profile-edit-field">
            <label htmlFor="skillInput">Add a skill</label>
            <div className="profile-edit-grid">
              <input
                id="skillInput"
                value={skillInput}
                maxLength={100}
                placeholder="e.g. Java, React, Public Speaking"
                onChange={(event) => {
                  setSkillInput(event.target.value);
                  setSkillsError('');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addEntry(skillInput, skills, setSkills, setSkillInput, setSkillsError, 'Skill');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addEntry(skillInput, skills, setSkills, setSkillInput, setSkillsError, 'Skill')}
                disabled={skills.length >= 30}
              >
                Add skill
              </button>
            </div>
            <small>{skills.length}/30 skills</small>
          </div>

          <div className="profile-edit-entry-list">
            {skills.map((skill) => (
              <div className="profile-edit-entry" key={skill}>
                <span>{skill}</span>
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => removeEntry(skill, skills, setSkills, setSkillsError)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {skillsError && <p className="profile-edit-error" role="alert">{skillsError}</p>}

          <button
            type="button"
            disabled={skillsMutation.isPending}
            onClick={() => {
              const error = validateEntries(skills, 'Skills');
              if (error) {
                setSkillsError(error);
                return;
              }
              skillsMutation.mutate(skills.map((skill) => skill.trim()));
            }}
          >
            {skillsMutation.isPending ? 'Saving skills...' : 'Save skills'}
          </button>
        </section>

        <section className="profile-edit-card">
          <h2>Interests</h2>
          <p>Share the topics, activities and causes you are interested in.</p>

          <div className="profile-edit-field">
            <label htmlFor="interestInput">Add an interest</label>
            <div className="profile-edit-grid">
              <input
                id="interestInput"
                value={interestInput}
                maxLength={100}
                placeholder="e.g. Entrepreneurship, Mentoring"
                onChange={(event) => {
                  setInterestInput(event.target.value);
                  setInterestsError('');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addEntry(interestInput, interests, setInterests, setInterestInput, setInterestsError, 'Interest');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addEntry(interestInput, interests, setInterests, setInterestInput, setInterestsError, 'Interest')}
                disabled={interests.length >= 30}
              >
                Add interest
              </button>
            </div>
            <small>{interests.length}/30 interests</small>
          </div>

          <div className="profile-edit-entry-list">
            {interests.map((interest) => (
              <div className="profile-edit-entry" key={interest}>
                <span>{interest}</span>
                <button
                  type="button"
                  aria-label={`Remove ${interest}`}
                  onClick={() => removeEntry(interest, interests, setInterests, setInterestsError)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {interestsError && <p className="profile-edit-error" role="alert">{interestsError}</p>}

          <button
            type="button"
            disabled={interestsMutation.isPending}
            onClick={() => {
              const error = validateEntries(interests, 'Interests');
              if (error) {
                setInterestsError(error);
                return;
              }
              interestsMutation.mutate(interests.map((interest) => interest.trim()));
            }}
          >
            {interestsMutation.isPending ? 'Saving interests...' : 'Save interests'}
          </button>
        </section>

        <section className="profile-edit-card">
          <h2>Profile image</h2>

          <div className="profile-edit-field">
            <label htmlFor="profileImageUrl">Image URL</label>
            <input
              id="profileImageUrl"
              name="profileImageUrl"
              type="url"
              maxLength={1000}
              placeholder="https://example.com/image.jpg"
              value={form.profileImageUrl ?? ''}
              onChange={(event) => updateField('profileImageUrl', event.target.value || null)}
            />
            <small>This saves image metadata only; direct S3 upload is not implemented yet.</small>
          </div>
        </section>

        {formError && (
          <p className="profile-edit-error" role="alert">
            {formError}
          </p>
        )}

        <div className="profile-edit-actions">
          <Link to="/profile" className="profile-edit-cancel">
            Cancel
          </Link>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </main>
  );
}

function ProfileEditPage() {
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
      <main className="profile-edit-page">
        <div className="profile-edit-state" role="status">
          Loading your profile...
        </div>
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className="profile-edit-page">
        <section className="profile-edit-state" role="alert">
          <h1>Unable to load your profile</h1>
          <p>{error instanceof Error ? error.message : 'Please try again.'}</p>
          <button type="button" onClick={() => void refetch()}>
            Try again
          </button>
          <Link to="/profile">Back to profile</Link>
        </section>
      </main>
    );
  }

  return <ProfileEditForm key={profile.id} profile={profile} />;
}

export default ProfileEditPage;
