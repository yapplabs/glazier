# Glazier Architecture (or, How Glazier Works)

This document explains how Glazier works, including the underlying components
and how they work together. The intended audience is developers who would like
to contribute to Glazier or to create or work on applications similar to
Glazier.

## What is Glazier?

As you may already know, Glazier is a dashboard application for developers to better understand the open source Github projects they work on, and the ecosystem around those projects.

Each project has a dashboard and each dashboard has a collection of "panes,"
also called cards. Each card has a narrow specific type of data it is designed
to display, and/or functions that it allows the user to take.

## What Makes Glazier Different from Other Dashboards?

Glazier employs an architecture that allows rich communication to, from and
between cards, while isolating each card's code to prevent malicious code
from having direct access to Glazier's back-end.

To achieve this, Glazier uses a library called
[Conductor.js](https://github.com/tildeio/conductor.js),
which in turn uses [Oasis.js](https://github.com/tildeio/oasis.js). These
libraries will be discussed below.

## High-Level Architecture

![Overview Diagram](./docs/diagrams/overview.png?raw=true)

At a high-level the major components of Glazier consist of the cards, the
container, the server, and persistence (database).

The server, written in Ruby on Rails, provides an API that uses the persistence
layer (PostgreSQL) to read and write dashboard data, data about the layout of
cards, as well as persistence of data owned by cards.

The container, written in Ember.js, communicates with that API as well as
hosting cards and providing services to those cards. The card hosting and
communication is handled by leveraging Oasis.js and Conductor.js.

## Glazier Container Architecture

### Conductor & Oasis

Oasis makes working with iFrame consistent across browser and provides a
pleasant API. It abstracts away the annoying parts of knowing when an iFrame has
finished loading, and of communicating securely across the iFrame boundary.

Conductor builds on top of Oasis to provide a set of built-in services available
to the iFrame, which Conductor dubs a "card". Using Conductor, it is possible to
easily load a card javascript and have it wired up to the built-in and custom
services automatically.

### Integrating Ember.js and Conductor

Ember is a Javascript MVC framework for building ambitious browser apps. It is
well-documented at emberjs.com.

Glazier integrates Ember.js and Conductor at two key places: card loading and
services.

A custom Ember.Object subclass called CardManager is responsible for coordinating
with Conductor to load and unload cards.

Meanwhile, Glazier's custom Conductor services are registered with the Ember
container, which allows them access to other parts of the Ember app, most
importantly, to singleton controllers.

#### Routes

Glazier's routes are few in number, but quite dynamic. The basic structure is:

    /:organization_name/:repository_name/:section_name

The first two parts correspond to a Github repository, and the last part specifies
the section. Sections are pages which repository users can create and edit and which
contain cards, or panes as Glazier calles them.

#### Services
#### Persisting Cards with Ember-Data

## Glazier Server Architecture

### Rails back-end
#### Persisting cards
#### Persisting card data

## Authentication in Glazier

TODO: detail auth flow

## How to Make Your Own Card

Follow the instructtions in the README of yapplabs/glazier-card-bootstrap to make
your own card. You will leverage the yapplabs/glazier-card-grunt-config module
to avoid having to reinvent the wheel on build steps.

