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
### Integrating Ember.js and Conductor
#### Routes
#### Services
#### Persisting Cards with Ember-Data

## Glazier Server Architecture

### Rails back-end
#### Persisting cards
#### Persisting card data

## Authentication in Glazier

TODO: detail auth flow

## How to Make Your Own Card

yapplabs/glazier-card-bootstrap
yapplabs/glazier-card-grunt-config

